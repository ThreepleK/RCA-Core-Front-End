import { lazy, ReactNode } from 'react'
import { createBrowserRouter } from 'react-router';
import type { RouteObject } from 'react-router';
import { KeepAliveRouter } from '@repo/core-ui';
import { CommLayout } from '@/compos/layout'
import { protectedLoader } from './protected'

// @ts-ignore
import Admin from 'admin/router';
// @ts-ignore
import Rca from 'rca/router';

const Main = {
    Home: lazy(() => import('@/features/home/home')),
}

// 인증 (로그인/가입 등)
const Auth = {
    SignIn: lazy(() => import('@/features/auth/sign-in')),
    SignOut: lazy(() => import('@/features/auth/sign-out')),
    // SignUp: lazy(() => import('@/features/auth/sign-up')),
    // ForgotPassword: lazy(() => import('@/features/auth/forgot-password')),
    // Otp: lazy(() => import('@/features/auth/otp')),
};

// 에러 관련
const Errors = {
    E401: lazy(() => import('@/features/errors/unauthorized-error')),
    E403: lazy(() => import('@/features/errors/forbidden')),
    E404: lazy(() => import('@/features/errors/not-found-error')),
    E500: lazy(() => import('@/features/errors/general-error')),
    E503: lazy(() => import('@/features/errors/maintenance-error')),
};

function wrapLayout(elem: ReactNode, path: string){
    return (
        <KeepAliveRouter cacheKey={`/${path}`}>{elem}</KeepAliveRouter>
    )
}

//* 라우터 내역
const routeList: RouteObject[] = [
    {
        path: '/',
        element: <CommLayout />,
        loader: protectedLoader,
        children: [
            { path: '', element: wrapLayout(<Main.Home />, '') },
            Rca,
            Admin
        ]
    },

    { path: '/sign-in', element: <Auth.SignIn />},
    { path: '/sign-out', element: <Auth.SignOut />},
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