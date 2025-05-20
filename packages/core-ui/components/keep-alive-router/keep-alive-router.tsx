import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router";
import { KeepAlive, useKeepAliveContext } from 'keepalive-for-react'
import { useRouterStore } from '@repo/shared-state'

/**
 * 라우터 Outlet 사용
 */
export function KeepAliveRouter({cacheKey, children}: {
    cacheKey: string;
    children: ReactNode;
}){
    return <>
        {/* 탭 기능을 위한 구간 */}
        <KeepAlive
            activeCacheKey={cacheKey}
            duration={0}
            transition={false}
        >
            {children}
        </KeepAlive>

        {/* 탭 기능 제어 */}
        <KeepAliveProcess />
    </>
}

function KeepAliveProcess(){
    const navigate = useNavigate();
    const { destroy } = useKeepAliveContext();
    const { currItem, currItemKey, rmItemKey, rmCacheKey } = useRouterStore(s => s);

    //* 신규 탭 처리
    useEffect(() => {
        if( currItem === null ){ return; }

        // 신규 탭 페이지 이동
        navigate(currItem.path);
    }, [currItemKey]);

    //* 탭 삭제 처리
    useEffect(() => {
        if( rmItemKey === null ){ return; }

        // 관련 탭 제거
        destroy(rmItemKey);
        rmCacheKey();
    }, [rmItemKey]);

    return <></>
}