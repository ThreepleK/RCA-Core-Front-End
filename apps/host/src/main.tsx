import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { ThemeProvider } from '@repo/core-ui'
import { initLeader } from '@repo/shared-state'

import { router } from '@/router'

import '@mantine/core/styles.css'
import './index.css'

//* 리프레시 토큰 시작
if (document.readyState === 'complete') {
  initLeader();
}

createRoot(document.getElementById('root')!).render(
  <ThemeProvider>
    <RouterProvider router={router} />
  </ThemeProvider>
)