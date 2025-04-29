import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import Layout from '@/compos/layout/comm-layout'

const Main = lazy(() => import('@/features/main'))
const UserGroup = lazy(() => import('@/features/user-group'))
const Permission = lazy(() => import('@/features/permission'))

//* 라우터 내역
export default {
    path: 'admin',
    element: <Layout />,
    children: [
        { path: '', element: <Main /> },
        { path: 'user-group', element: <UserGroup /> },
        { path: 'permission', element: <Permission /> },
    ]
} as RouteObject;