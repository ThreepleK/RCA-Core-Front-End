import { createContext, FC, ReactNode, useContext, useRef } from "react";
import { StoreApi } from "zustand";
import { ContLayoutState, createContLayoutStore } from "./";

type LayoutStoreType = StoreApi<ContLayoutState>;

const ContsLayoutCtx = createContext<LayoutStoreType | null>(null);

/**
 * 레이아웃 상태 등록
 */
export const ContsLayoutProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const ref = useRef<LayoutStoreType>(null);

    if( !ref.current ){
        ref.current = createContLayoutStore();
    }

    return (
        <ContsLayoutCtx.Provider value={ref.current}>
            {children}
        </ContsLayoutCtx.Provider>
    );
}

export const useContsLayoutStore = () => {
    const store = useContext(ContsLayoutCtx);

    if( !store ){
        throw new Error('useContsLayoutStore must be used within LayoutStoreType');
    }

    return store;
}