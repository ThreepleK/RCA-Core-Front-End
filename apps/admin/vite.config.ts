import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { federation } from '@module-federation/vite';
import envs from '../../packages/env/env-common';

/** @type {import('vite').UserConfig} */
export default defineConfig((({ mode }: any) => {
  const remote = (envs.remoteAppHost as any)[mode];
  const accKey = envs.remoteAccessKey.admin;
  const exposes = envs.exposeSync.admin;
  const filename = envs.mf_fileName;

  return {
    publicDir: path.resolve(__dirname, './public'),
    define: { '$resourceUrl': JSON.stringify(remote.admin) },
    build: {
      target: 'chrome89',
    },
    base: `${remote.admin}`,
    plugins: [
      federation({
        name: accKey,
        filename,
        exposes,
        shared: {
          react: { singleton: true },
          '@repo/shared-state': { singleton: true }
        }
      }),
      react(),
      tailwindcss(),
    ],
    server: {
      port: 5009,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs'
      },
    },
  };
}))
