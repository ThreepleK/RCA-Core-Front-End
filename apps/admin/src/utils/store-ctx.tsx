import { createContext, FC, ReactNode, useContext, useRef } from "react";
import { StoreApi, UseBoundStore } from "zustand";

/**
 * zustand Store
 * Context 만들기 (독립적인 상태 관리 용)
 */
export function storeContext<T>(zustandStore: ()=>UseBoundStore<StoreApi<T>>){
    // 컨텍스트 만들기
    const Ctx = createContext<UseBoundStore<StoreApi<T>>|null>(null);

    // Provider 컴포넌트
    const Provider: FC<{ children: ReactNode }> = ({ children }) => {
        const ref = useRef<UseBoundStore<StoreApi<T>>|null>(null);

        if( !ref.current ){
            ref.current = zustandStore();
        }

        return (
            <Ctx.Provider value={ref.current}>
                {children}
            </Ctx.Provider>
        );
    }

    // useContext
    const useStore = () => {
        const store = useContext(Ctx);

        if( !store ){ throw new Error('useStore Error'); }

        return store;
    }

    return {Provider, useStore};
}