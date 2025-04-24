import { createBrowserRouter } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import { lazy } from 'react'

// 메인 메뉴 모음
const Main = {
     // @ts-ignore
    Root: lazy(() => import('@/features/main')),
    // @ts-ignore
    User: lazy(() => import('@/features/user-group')),
    // @ts-ignore
    Permission: lazy(() => import('@/features/permission')),
};

//* 라우터 내역
const routeList: RouteObject[] = [
    {
        path: '/',
        children: [
            { path: '/', element: <Main.Root /> },
            { path: '/user-group', element: <Main.User /> },
            { path: '/permission', element: <Main.Permission /> },
        ]
    },
];

export const router = createBrowserRouter(routeList, {
    basename: '/admin'   // 기본 도메인 주소
});