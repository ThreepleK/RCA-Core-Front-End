import { ReactNode, Suspense } from "react";
import { Outlet } from "react-router-dom";

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

function CustomSuspense(props: { children: ReactNode }) {
    const { children } = props;

    return (
        <Suspense fallback={<div className="flex justify-center items-center text-[12px] w-full h-full">Loading...</div>}>
            {children}
        </Suspense>
    );
}