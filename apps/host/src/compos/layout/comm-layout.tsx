import { useKeepAliveRef } from "keepalive-for-react";
import KeepAliveRouteOutlet from "keepalive-for-react-router";
import { ReactNode, Suspense, useEffect, useMemo, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from '@/lib/utils'
import { AppShell } from '@mantine/core';

import AppSidebar from "./app-sidebar";
import { MainMenu } from "../ui/main-menu";

export default function() {
    const location = useLocation();
    const activePath = location.pathname + location.search;
    const aliveRef = useKeepAliveRef();

    return (
        <AppShell
            navbar={{
                width: 250,
                breakpoint: 'sm',
            }}
            padding="0"
        >
            <AppShell.Navbar className="flex gap-y-3 p-3">
                <AppSidebar />
                <MainMenu />
            </AppShell.Navbar>
            <AppShell.Main>
                <CustomSuspense>
                    <KeepAliveRouteOutlet
                        wrapperComponent={MemoScrollTopWrapper}
                        duration={0}
                        transition={false}
                        // exclude={["/tasks"]}
                        aliveRef={aliveRef}
                        containerClassName='w-full h-full'
                    />
                </CustomSuspense>
            </AppShell.Main>
        </AppShell>
    )
}

/**
 * 페이지 전환 시 기억한 스크롤 위치로 이동
 */
function MemoScrollTopWrapper(props: { children?: ReactNode }) {
    const { children } = props;
    const domRef = useRef<HTMLDivElement>(null);
    const location = useLocation();
    const scrollHistoryMap = useRef<Map<string, number>>(new Map());

    const activeKey = useMemo(() => {
        return location.pathname + location.search;
    }, [location.pathname, location.search]);

    useEffect(() => {
        const divDom = domRef.current;
        if (!divDom) return;
        setTimeout(() => {
            divDom.scrollTo(0, scrollHistoryMap.current.get(activeKey) || 0);
        }, 300); // 300 milliseconds to wait for the animation transition ending
        const onScroll = (e: Event) => {
            const target = e.target as HTMLDivElement;
            if (!target) return;
            scrollHistoryMap.current.set(activeKey, target?.scrollTop || 0);
        };
        divDom?.addEventListener("scroll", onScroll, {
            passive: true,
        });
        return () => {
            divDom?.removeEventListener("scroll", onScroll);
        };
    }, [activeKey]);

    return (
        <div
            className={cn(
                'ml-auto w-full max-w-full',
                'peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]',
                'peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]',
                'transition-[width] duration-200 ease-linear',
                'flex flex-col',
                'group-data-[scroll-locked=1]/body:h-full',
                'group-data-[scroll-locked=1]/body:has-[main.fixed-main]:h-svh',
                'animation-wrapper scrollbar w-full overflow-auto'
            )}
            id='content'
            ref={domRef}
        >{children}</div>
    );
}


function CustomSuspense(props: { children: ReactNode }) {
    const { children } = props;
    return <Suspense fallback={<div className="text-center text-red-400 text-[12px] mt-[10px]">Loading...</div>}>{children}</Suspense>;
}