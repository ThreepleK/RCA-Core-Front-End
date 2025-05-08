import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import Layout from '@/compos/layout/comm-layout'

const Main = lazy(() => import('@/features/main'))
const UserGroup = lazy(() => import('@/features/user-group'))
const Permission = lazy(() => import('@/features/permission'))
const SidebarMenu = lazy(() => import('@/features/sidebar-menu'))
const ApplicationMenu = lazy(() => import('@/features/application-menu'))

//* 라우터 내역
export default {
    path: 'admin',
    element: <Layout />,
    children: [
        { path: '', element: <Main /> },
        { path: 'user-group', element: <UserGroup /> },
        { path: 'permission', element: <Permission /> },
        { path: 'application-menu', element: <ApplicationMenu /> },
        { path: 'sidebar-menu', element: <SidebarMenu /> },
    ]
} as RouteObject;