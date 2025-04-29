import type { RouteObject } from 'react-router-dom'
// import CommLayout from '@/compos/layout/comm-layout'

// 메인 메뉴 모음
import Root from '@/features/main'
import Test from '@/features/test'
    
//* 라우터 내역
export default {
    path: 'rca',
    // element: <CommLayout />,
    children: [
        { path: '', element: <Root /> },
        { path: 'test', element: <Test /> },
    ]
} as RouteObject;