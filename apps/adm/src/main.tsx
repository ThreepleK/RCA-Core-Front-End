import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { AntdThemeProvider } from '@repo/core-ui'
import router from './router';

//* 앱 기본 스타일
import './index.css'

createRoot(document.getElementById('root')!).render(
  <AntdThemeProvider>
    <RouterProvider router={router} />
  </AntdThemeProvider>
)
