import { createContext, FC, ReactNode, useContext, useRef } from "react";
import { StoreApi } from "zustand";
import { BasicGridEventState, BasicGridState, createBasicGridEvntsStore, createBasicGridStore } from "./basic-theme-store";

type GridStoreType = StoreApi<BasicGridState<any>>;
type EventStoreType = StoreApi<BasicGridEventState>;

const GridCtx = createContext<GridStoreType | null>(null);
const GridEvntCtx = createContext<EventStoreType | null>(null);

/**
 * 그리드 상태 등록
 */
export const GridProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const storeRef = useRef<GridStoreType>(null);

    if( !storeRef.current ){
        storeRef.current = createBasicGridStore();
    }

    return (
        <GridCtx.Provider value={storeRef.current}>
            {children}
        </GridCtx.Provider>
    );
}

/**
 * 그리드 이벤트 등록
 */
export const GridEventProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const storeRef = useRef<EventStoreType>(null);

    if( !storeRef.current ){
        storeRef.current = createBasicGridEvntsStore();
    }

    return (
        <GridEvntCtx.Provider value={storeRef.current}>
            {children}
        </GridEvntCtx.Provider>
    );
}

export const useGridStore = () => {
    const store = useContext(GridCtx);

    if( !store ){
        throw new Error('useGridStore must be used within GridProvider');
    }

    return store;
}

export const useGridEventStore = () => {
    const store = useContext(GridEvntCtx);

    if( !store ){
        throw new Error('useGridEventStore must be used within GridEventProvider');
    }

    return store;
}