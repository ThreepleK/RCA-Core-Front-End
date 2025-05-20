import { ReactNode } from 'react';
import type { RouteObject } from 'react-router'
import { KeepAliveRouter } from '@repo/core-ui';
// import CommLayout from '@/compos/layout/comm-layout'

// 메인 메뉴 모음
import Root from '@/features/main'
import Test from '@/features/test'

function wrapLayout(elem: ReactNode, path: string){
    return <KeepAliveRouter cacheKey={`rca/${path}`}>{elem}</KeepAliveRouter>;
}
    
//* 라우터 내역
export default {
    path: 'rca',
    children: [
        { path: '', element: wrapLayout(<Root />, '') },
        { path: 'test', element: wrapLayout(<Test />, 'test') },
    ]
} as RouteObject;