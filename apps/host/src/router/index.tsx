import { createBrowserRouter } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import { lazy } from 'react'
import Layout from '@/compos/layout/comm-layout'

// 메인 메뉴 모음
const Main = {
    // @ts-ignore
    Rca: lazy(() => import('rca/main')),
};

// // AG Grid관련
// const AGGrid = {
//     Grid: lazy(() => import('@/features/aggrid/grid')),
//     Chart: lazy(() => import('@/features/aggrid/chart')),
// };

// const Settings = {
//     _Layout: lazy(() => import('@/features/settings')),
//     Profile: lazy(() => import('@/features/settings/profile')),
//     Account: lazy(() => import('@/features/settings/account')),
//     Appearance: lazy(() => import('@/features/settings/appearance')),
//     Notifications: lazy(() => import('@/features/settings/notifications')),
//     Display: lazy(() => import('@/features/settings/display')),
// };

// // 인증 (로그인/가입 등)
// const Auth = {
//     SignIn: lazy(() => import('@/features/auth/sign-in')),
//     SignIn2: lazy(() => import('@/features/auth/sign-in/sign-in-2')),
//     SignUp: lazy(() => import('@/features/auth/sign-up')),
//     ForgotPassword: lazy(() => import('@/features/auth/forgot-password')),
//     Otp: lazy(() => import('@/features/auth/otp')),
// };

// 에러 관련
const Errors = {
    E401: lazy(() => import('@/features/errors/unauthorized-error')),
    E403: lazy(() => import('@/features/errors/forbidden')),
    E404: lazy(() => import('@/features/errors/not-found-error')),
    E500: lazy(() => import('@/features/errors/general-error')),
    E503: lazy(() => import('@/features/errors/maintenance-error')),
};

//* 라우터 내역
const routeList: RouteObject[] = [
    {
        path: '/',
        element: <Layout />,
        children: [
            // { path: '/', element: <Main.Dashboard /> },
            { path: '/rca/*', element: <Main.Rca /> },
            // { path: '/chats', element: <Main.Charts /> },
            // { path: '/apps', element: <Main.Apps /> },
            // { path: '/users', element: <Main.Users />},

            // { path: '/aggrid/chart', element: <AGGrid.Chart />},
            // { path: '/aggrid/grid', element: <AGGrid.Grid />},

            // {
            //     path: '/settings',
            //     element: <Settings._Layout />,
            //     children: [
            //         { path: '/settings/', element: <Settings.Profile />},
            //         { path: '/settings/account', element: <Settings.Account />},
            //         { path: '/settings/appearance', element: <Settings.Appearance />},
            //         { path: '/settings/notifications', element: <Settings.Notifications />},
            //         { path: '/settings/display', element: <Settings.Display />},
            //     ]
            // },
            // { path: '/help-center', element: <Main.HelpCenter />},
        ]
    },

    // { path: '/sign-in', element: <Auth.SignIn />},
    // { path: '/sign-up', element: <Auth.SignUp />},
    // { path: '/forgot-password', element: <Auth.ForgotPassword />},
    // { path: '/otp', element: <Auth.Otp />},

    { path: '/401', element: <Errors.E401 />},
    { path: '/403', element: <Errors.E403 />},
    { path: '/404', element: <Errors.E404 />},
    { path: '/500', element: <Errors.E500 />},
    { path: '/503', element: <Errors.E503 />},
];

export const router = createBrowserRouter(routeList, {
    basename: '/'   // 기본 도메인 주소
});