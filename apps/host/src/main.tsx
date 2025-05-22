import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { ThemeProvider } from '@repo/core-ui'
import { initLeader } from '@repo/shared-state'

import { router } from '@/router'

//* mantine 기본 스타일 가져오기
import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'

//* 앱 기본 스타일
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