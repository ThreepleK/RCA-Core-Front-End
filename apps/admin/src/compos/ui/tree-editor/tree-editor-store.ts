import { create } from 'zustand';
import { TreeItems, TreeItem } from 'dnd-kit-sortable-tree';
import { v4 as uuidv4 } from 'uuid'

//* 트리 아이템 추가 타입
export type TREE_ITEM_TYPE = {
    label: string;                      // 메뉴 명
    nodeProps?: {                       // ---- DB 데이터 값 ----
        level: number;                  // 메뉴 Depth
        sortOrder: number;              // 메뉴 Depth 별 순서
        id: string;                     // 메뉴 ID
        parentMenuId: string|null,      // 부모 메뉴 ID
        name: string;                   // 메뉴 명
        displayName: string;            // 화면에 보일 메뉴명
        url: string;                    // 이동 경로
        openNewTab: boolean;            // 신규 탭 열림 여부
        isVisible: boolean;             // 메뉴 보임 여부
    };
};

// 트리 목록
export type TREE_LIST = TreeItems<TREE_ITEM_TYPE>;
export type TREE_ITEM = TreeItem<TREE_ITEM_TYPE>;

//* 트리 State
interface TreeState {
    // state ----
    list: TREE_LIST;                        // Tree 목록
    flag: boolean;                          // 강제 렌더링 플래그

    // action ----
    setTreeList: (list: TREE_LIST) => void; // tree 목록 설정
    addTreeItem: (                          // tree 아이템 추가
        addId: string,
        label: string,
        isRoot: boolean
    ) => void;
    modTreeItem: (                          // tree 아이템 수정
        modId: string,
        label: string
    ) => void;
    rmTreeItem: (rmId: string) => void;     // tree 아이템 제거
}

// 트리 store
export const useTreeStore = create<TreeState>((set, get) => ({
    list: [],
    flag: false,
    
    setTreeList: (list) => set({ list, flag: !get().flag, }),
    addTreeItem: (addId, label, isRoot=false) => {
        const list = get().list;

        //* 맨 상단 메뉴일 경우
        if( isRoot ){
            list.push({
                id: uuidv4(),
                label: label
            });
        }
        //* 그 아래 메뉴일 경우
        else {
            // 아이템 찾아서 하위에 추가
            const {isSearch} = listSearch(list, addId, (items, idx) => {
                if( !items[idx].children ){
                    items[idx].children = [];
                }
    
                items[idx].children.push({
                    id: uuidv4(),
                    label: label
                });
            });
    
            // 추가 한적이 없다면
            if( !isSearch ){ return; }
        }


        set({
            list: [...list],
            flag: !get().flag,
        });
    },
    modTreeItem: (modId, label) => {
        const list = get().list;

        // 아이템 찾아서 이름 변경
        const {isSearch} = listSearch(list, modId, (items, idx) => {
            items[idx].label = label;
        });

        // 변경 한적이 없다면
        if( !isSearch ){ return; }

        set({
            list: [...list],
            flag: !get().flag,
        });
    },
    rmTreeItem: (rmId) => {
        const list = get().list;

        // 아이템 찾아서 제거
        const {isSearch} = listSearch(list, rmId, (items, idx) => {
            let tmp: any = items.splice(idx, 1);
            tmp = null;
        });

        // 제거 대상이 없었을 경우 끝
        if( !isSearch ){ return; }

        set({
            list: [...list],
            flag: !get().flag,
        });
    },
}));

/**
 * 트리 내역 중에 관련 id 찾기
 */
function listSearch(
    list: TREE_LIST,
    id: string,
    searchItem: (items: TREE_LIST, targetIdx: number) => void,
){
    let isSearch = false;
    const loop = (items: TREE_LIST) => {
        let i = -1;
        for( const item of items ){
            ++i;
            if( !item.id ){ continue; }

            // 해당 id 
            if( item.id === id ){
                searchItem(items, i);
                isSearch = true;
                break;
            }
            // 하위 항목 반복
            if( item.children && item.children.length > 0 ){
                loop(item.children);
            }
        }
    }
    loop(list);

    return {isSearch, list};
}