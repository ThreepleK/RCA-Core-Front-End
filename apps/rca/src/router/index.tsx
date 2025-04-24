import { createBrowserRouter } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import { lazy } from 'react'
import CommLayout from '@/compos/layout/comm-layout';

// 메인 메뉴 모음
const Main = {
    Root: lazy(() => import('@/features/main')),
    Test: lazy(() => import('@/features/test')),
};

//* 라우터 내역
const routeList: RouteObject[] = [
    {
        path: '/',
        element: <CommLayout />,
        children: [
            { path: '/', element: <Main.Root /> },
            { path: '/test', element: <Main.Test /> },
        ]
    },
];

export const router = createBrowserRouter(routeList, {
    basename: '/rca'   // 기본 도메인 주소
});