import { createContext, FC, ReactNode, useContext, useRef } from "react";
import { StoreApi } from "zustand";
import { createTreeStore, TreeState } from "./tree-editor-store";

type TreeStoreType = StoreApi<TreeState>;

const TreeCtx = createContext<TreeStoreType | null>(null);

/**
 * 트리 상태 등록
 */
export const TreeProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const storeRef = useRef<TreeStoreType>(null);

    if( !storeRef.current ){
        storeRef.current = createTreeStore();
    }

    return (
        <TreeCtx.Provider value={storeRef.current}>
            {children}
        </TreeCtx.Provider>
    );
}

export const useTreeStore = () => {
    const store = useContext(TreeCtx);

    if( !store ){
        throw new Error('useTreeStore must be used within TreeProvider');
    }

    return store;
}