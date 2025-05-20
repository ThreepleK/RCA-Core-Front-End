import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { federation } from '@module-federation/vite';
import envs from '../../packages/env/env-common';

/** @type {import('vite').UserConfig} */
export default defineConfig((({ mode }: any) => {
  const remote = (envs.remoteAppHost as any)[mode];
  const accKey = envs.remoteAccessKey.rca;
  const exposes = envs.exposeSync.rca;
  const filename = envs.mf_fileName;

  return {
    publicDir: path.resolve(__dirname, './public'),
    define: { '$resourceUrl': JSON.stringify(remote.rca) },
    build: {
      target: 'chrome89',
    },
    base: `${remote.rca}`,
    plugins: [
      federation({
        name: accKey,
        filename,
        exposes,
        shared: {
          react: { singleton: true },
          'keepalive-for-react': { singleton: true },
          'react-router': { singleton: true },
          '@mantine/core': { singleton: true },
          '@repo/shared-state': { singleton: true },
          '@repo/core-ui': { singleton: true },
        }
      }),
      react(),
      tailwindcss(),
    ],
    server: {
      port: 5001,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs'
      },
    },
  };
}))
