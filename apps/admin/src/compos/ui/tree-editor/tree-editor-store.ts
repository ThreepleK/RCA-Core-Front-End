import { create } from 'zustand';
import { TreeItems, TreeItem } from 'dnd-kit-sortable-tree';
import { v4 as uuidv4 } from 'uuid'

//* 트리 아이템 추가 타입
export type TREE_ITEM_TYPE = {
    label: string;                      // 메뉴 명
    itemType?: 'new'|'update'|'';       // 아이템 타입
    selected: boolean;                  // 선택 여부
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
        isActive: boolean;              // 메뉴 기능 여부
    };
};


// 트리 목록
export type TREE_LIST = TreeItems<TREE_ITEM_TYPE>;
export type TREE_ITEM = TreeItem<TREE_ITEM_TYPE>;

//* 트리 State
interface TreeState {
    // state ----
    rootItem: TREE_ITEM;                    // Tree 최상위 아이템
    list: TREE_LIST;                        // Tree 목록
    flag: boolean;                          // 강제 렌더링 플래그
    selectedItem: TREE_ITEM|null;           // Tree 목록 중 선택된 아이템
    isSelectedRoot: boolean;                // 선택된 아이템이 root 아이템인지 여부
    isItemUpdate: boolean;                  // Tree 아이템 업데이트 신호

    // action ----
    setTreeList: (list: TREE_LIST) => void;         // tree 목록 설정
    setTreeRootItem: (item: TREE_ITEM) => void;     // tree root 아이템 설정
    setTreeChildList: (list: TREE_LIST) => void;    // tree 하위 목록 설정
    setSelectedItem: (id: string) => void;          // tree 목록 선택
    addTreeItem: (                                  // tree 아이템 추가
        addId: string,
        label: string,
        isRoot: boolean
    ) => void;
    modTreeItem: (                                  // tree 아이템 수정
        modId: string,
        label: string
    ) => void;
    rmTreeItem: (rmId: string) => void;             // tree 아이템 제거
    updateTreeItem: (                               // tree 아이템 통 업데이트
        updateId: string,
        label: string,
        item: TREE_ITEM_TYPE['nodeProps']
    ) => void;
    setIsUpdate: (is: boolean) => void;             // 아이템 업데이트 신호 처리
}

// 트리 store
export const useTreeStore = create<TreeState>((set, get) => ({
    rootItem: null,
    list: [],
    flag: false,
    selectedItem: null,
    isSelectedRoot: false,
    isItemUpdate: false,
    
    setTreeList: (list) => {
        // 등록 값이 없을경우
        if( list.length === 0 ){ return; }

        // root 아이템 가져오기
        const rootItem = list[0];
        // 원본 하위 내역 가져오기
        const children = JSON.parse(JSON.stringify(rootItem.children));

        // root 아이템 하위 내역 제거
        delete rootItem.children;

        set({
            rootItem,
            list: children,
            flag: !get().flag,
        });
    },
    setTreeRootItem: (item) => {
        set({ rootItem: item, flag: !get().flag });
    },
    setTreeChildList: (cList) => {
        set({ list: cList, flag: !get().flag });
    },
    setSelectedItem: (id) => {
        const { rootItem, list, flag } = get();

        let selected: TREE_ITEM|null = null;
        let isSelectedRoot: boolean = false;

        // 선택 처리
        listAllLoop(rootItem, list, (item, isRoot) => {
            if( item.id === id ){
                selected = item;
                isSelectedRoot = isRoot;
                item.selected = true;
            } else {
                item.selected = false;
            }
        });

        // 변경 값 재설정
        if( isSelectedRoot ){
            set({
                rootItem: {...rootItem},
                selectedItem: selected,
                isSelectedRoot,
                flag: !flag,
            });
        } else {
            set({
                list: [...list],
                selectedItem: selected,
                isSelectedRoot,
                flag: !flag,
            });
        }
    },
    addTreeItem: (addId, label, isRoot=false) => {
        const {list} = get();

        //* 맨 상단 메뉴일 경우
        if( isRoot ){
            list.push({
                id: uuidv4(),
                label: label,
                itemType: 'new',
                selected: false,
            });
        }
        //* 그 아래 메뉴일 경우
        else {
            // 아이템 찾아서 하위에 추가
            const {isSearch} = listSearch(null, list, addId, (items, idx) => {
                if( !items[idx].children ){
                    items[idx].children = [];
                }
    
                items[idx].children.push({
                    id: uuidv4(),
                    label: label,
                    itemType: 'new',
                    selected: false,
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
        const {rootItem, list} = get();

        let isSelectedRoot: boolean = false;

        // 아이템 찾아서 이름 변경
        const {isSearch} = listSearch(rootItem, list, modId, (items, idx, isRoot) => {
            items[idx].label = label;
            items[idx].itemType = items[idx]?.itemType !== 'new' ? 'update' : 'new';
            isSelectedRoot = isRoot;
        });

        // 변경 한적이 없다면
        if( !isSearch ){ return; }

        // root에 따른 데이터 설정
        const setData = {};
        if( isSelectedRoot ){
            setData['rootItem'] = {...rootItem};
        } else {
            setData['list'] = [...list];
        }

        set({
            ...setData,
            flag: !get().flag,
        });
    },
    rmTreeItem: (rmId) => {
        const {list} = get();

        // 아이템 찾아서 제거
        const {isSearch} = listSearch(null, list, rmId, (items, idx) => {
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

    updateTreeItem: (updateId, label, item) => {
        const {rootItem, list, flag} = get();

        let isSelectedRoot: boolean = false;

        // 아이템 찾아서 교체
        const {isSearch} = listSearch(rootItem, list, updateId, (items, idx, isRoot) => {
            items[idx].label = label;
            items[idx].itemType = items[idx]?.itemType !== 'new' ? 'update' : 'new';
            items[idx].nodeProps = item;
            isSelectedRoot = isRoot;
        });

        // 교체 한적이 없다면
        if( !isSearch ){ return; }

        // root에 따른 데이터 설정
        if( isSelectedRoot ){
            set({
                rootItem: {...rootItem},
                flag: !flag,
            });
        } else {
            set({
                list: [...list],
                flag: !flag,
            });
        }
    },

    setIsUpdate: (is: boolean) => {
        set({
            isItemUpdate: is
        });
    }
}));

/**
 * 트리 내역 전체 반복
 */
function listAllLoop(
    rootItem: TREE_ITEM,
    list: TREE_LIST,
    callback: (items: TREE_ITEM, isRoot: boolean) => void,
){
    const loop = (items: TREE_LIST, isRoot: boolean) => {
        for( const item of items ){
            callback(item, isRoot);

            // 하위 항목 반복
            if( item.children && item.children.length > 0 ){
                loop(item.children, isRoot);
            }
        }
    }
    loop([rootItem], true);
    loop(list, false);
}

/**
 * 트리 내역 중에 관련 id 찾기
 */
function listSearch(
    rootItem: TREE_ITEM,
    list: TREE_LIST,
    id: string,
    searchItem: (items: TREE_LIST, targetIdx: number, isRoot: boolean) => void,
){
    let isSearch = false;
    const loop = (items: TREE_LIST, isRoot: boolean) => {
        let i = -1;
        for( const item of items ){
            ++i;
            if( !item.id ){ continue; }

            // 해당 id 
            if( item.id === id ){
                searchItem(items, i, isRoot);
                isSearch = true;
                break;
            }
            // 하위 항목 반복
            if( item.children && item.children.length > 0 ){
                loop(item.children, isRoot);
            }
        }
    }
    // root 아이템이 있는 경우
    if( rootItem !== null){
        loop([rootItem], true);
        if( isSearch ){ return {isSearch}; }
    }

    // 하위 아이템일 경우
    loop(list, false);
    return {isSearch};
}