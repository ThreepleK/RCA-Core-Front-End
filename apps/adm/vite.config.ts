import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { federation } from '@module-federation/vite';
import envs from '../../packages/env/env-common';

// https://vite.dev/config/
export default defineConfig((({ mode }: any) => {

  const remote = (envs.remoteAppHost as any)[mode];
  const accKey = envs.remoteAccessKey.adm;
  const exposes = envs.exposeSync.adm;
  const filename = envs.mf_fileName;

  return {
    publicDir: path.resolve(__dirname, './public'),
    define: { '$resourceUrl': JSON.stringify(remote.adm) },
    build: {
      target: 'chrome89',
    },
    base: `${remote.adm}`,
    plugins: [
      federation({
        name: accKey,
        filename,
        exposes,
        shared: {
          react: { singleton: true },
          'keepalive-for-react': { singleton: true },
          'react-router': { singleton: true },
          '@repo/shared-state': { singleton: true },
          '@repo/core-ui': { singleton: true },
        }
      }),
      react(),
      tailwindcss(),
    ],
    server: {
      port: 5010,
      proxy: {
        '/admin/api': {
          target: 'http://192.168.7.230:9081',
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
