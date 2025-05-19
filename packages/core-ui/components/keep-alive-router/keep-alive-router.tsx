import { ReactNode, RefObject, Suspense, useEffect, useMemo } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { KeepAlive, KeepAliveRef, useKeepAliveRef } from 'keepalive-for-react'
import { useRouterStore } from '@repo/shared-state'

export function KeepAliveRouter({isHost}: {
    isHost?: boolean
}){
    return <>
        {isHost ? <HostRouter /> : <CustomOutlet />}
    </>;
}

/**
 * 라우터 Outlet
 */
function CustomOutlet(){
    return <>
        <CustomSuspense>
            <Outlet />
        </CustomSuspense>
    </>;
}

/**
 * 메인이 되는 Host 라우터
 */
function HostRouter(){
    const aliveRef = useKeepAliveRef();
    const { currItem } = useRouterStore(s => s);

    // 활성화 키 설정
    const activeKey = useMemo(() => currItem === null ? null : currItem.cacheKey, [currItem]);

    useEffect(() => {
        console.log('activeKey', activeKey, aliveRef?.current?.getCacheNodes())
    }, [activeKey])

    return <>
        <KeepAlive aliveRef={aliveRef} activeCacheKey={(activeKey??'')}>
            <CustomOutlet />
        </KeepAlive>

        <RouterProcess aliveRef={aliveRef} />
    </>
}

/**
 * 라우터 처리
 */
function RouterProcess({aliveRef}: {
    aliveRef: RefObject<KeepAliveRef | undefined>
}){
    const navigate = useNavigate();
    const { currItem, rmItemKey, rmCacheKey } = useRouterStore(s => s);

    //* 신규 탭 처리
    useEffect(() => {
        if( currItem === null ){ return; }

        // 신규 탭 페이지 이동
        navigate(currItem.path);
    }, [currItem]);

    //* 탭 삭제 처리
    useEffect(() => {
        if( rmItemKey === null ){ return; }

        // 관련 탭 제거
        aliveRef.current?.destroy(rmItemKey);
        rmCacheKey();
    }, [rmItemKey]);

    return <></>;
}

/**
 * 라우터 로딩 화면
 */
function CustomSuspense(props: { children: ReactNode }) {
    const { children } = props;

    return (
        <Suspense fallback={<div className="flex justify-center items-center text-[12px] w-full h-full">Loading...</div>}>
            {children}
        </Suspense>
    );
}