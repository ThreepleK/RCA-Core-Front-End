import { createRoot } from 'react-dom/client'

import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@repo/core-ui';
import { router } from '@/router'

import '@mantine/core/styles.css';
import './App.css'

createRoot(document.getElementById('root')!).render(
  <ThemeProvider>
    <RouterProvider router={router} />
  </ThemeProvider>
)
