import { ReactNode, Suspense, useEffect, useMemo, useRef, RefObject } from "react";
import type { KeepAliveRef } from "keepalive-for-react";
import { KeepAlive, useKeepAliveRef } from "keepalive-for-react";
import KeepAliveRouteOutlet from "keepalive-for-react-router";
import { useLocation, Outlet } from "react-router-dom";

export function KeepAliveRouter(){
    // const aliveRef = useKeepAliveRef();
    // const {pathname, search} = useLocation();

    // 활성화 키 설정
    // const activeKey = useMemo(() => getActiveKey(pathname, search), [pathname, search]);

    // console.log( activeKeyParser(activeKey) )
    // console.log('aliveRef', aliveRef.current?.getCacheNodes());

    return (
        // <KeepAlive aliveRef={aliveRef} activeCacheKey={activeKey}>
            <CustomSuspense>
                <Outlet />
            </CustomSuspense>
        // </KeepAlive>
    );

    // return <CustomSuspense>
    //     <KeepAliveRouteOutlet
    //         activeCacheKey={activeKey}
    //         // wrapperComponent={(props: any) => MemoScrollTopWrapper({aliveRef, ...props})}
    //         duration={0}
    //         transition={false}
    //         // exclude={['']}
    //         aliveRef={aliveRef}
    //         containerClassName='w-full h-full'
    //     />
    // </CustomSuspense>;
}

/**
 * 탭 키로 사용할 값 가져오기
 */
function getActiveKey(
    pathname: string,   // 접속 주소 
    search: string,     // 주소 Get Parameter
) {
    return pathname + search;
}

/**
 * 페이지 전환 시 기억한 스크롤 위치로 이동
 */
function MemoScrollTopWrapper({ children, aliveRef }: {
    children?: ReactNode;
    aliveRef: RefObject<KeepAliveRef | undefined>;
}) {
    const domRef = useRef<HTMLDivElement>(null);
    const { pathname, search } = useLocation();
    
    // const scrollHistoryMap = useRef<Map<string, number>>(new Map());

    // 활성화 키
    const activeKey = useMemo(() => getActiveKey(pathname, search), [pathname, search]);

    useEffect(() => {
        const divDom = domRef.current;
        if (!divDom) return;
        
        console.log(activeKey);
        // console.log(aliveRef.current?.getCacheNodes());

        // setTimeout(() => {
        //     divDom.scrollTo(0, scrollHistoryMap.current.get(activeKey) || 0);
        // }, 500);

        // const onScroll = (e: Event) => {
        //     const target = e.target as HTMLDivElement;
        //     if (!target) return;

        //     scrollHistoryMap.current.set(activeKey, target?.scrollTop || 0);
        // };

        // divDom?.addEventListener("scroll", onScroll, {passive: true});

        // return () => {
        //     divDom?.removeEventListener("scroll", onScroll);
        // };
    }, [activeKey]);

    return (
        <div
            className={[
                'ml-auto w-full max-w-full',
                'peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]',
                'peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]',
                'transition-[width] duration-200 ease-linear',
                'flex flex-col',
                'group-data-[scroll-locked=1]/body:h-full',
                'group-data-[scroll-locked=1]/body:has-[main.fixed-main]:h-svh',
                'animation-wrapper scrollbar w-full overflow-auto'
            ].join(' ')}
            id='content'
            ref={domRef}
        >{children}</div>
    );
}

function CustomSuspense(props: { children: ReactNode }) {
    const { children } = props;

    return (
        <Suspense fallback={<div className="flex justify-center items-center text-[12px] w-full h-full">Loading...</div>}>
            {children}
        </Suspense>
    );
}