import { create } from 'zustand';

// tab: 같은 탭이 있을 경우 해당 탭 활성 / new-tab: 무조건 신규탭 생성 / move: 이동
export type itemType = 'tab' | 'new-tab' | 'move';

export type RouterItem = {
    cacheKey: string;               // 캐시 키 값
    tabLabel: string;               // UI에 보여질 탭 이름
    itemType: itemType;             // 탭 처리 타입
    path: string;                   // 관련 경로
};

//* 라우터 상태
export interface RouterState {
    // state
    list: RouterItem[];                     // 라우터 내역
    currItem: RouterItem|null;              // 현 라우터 값
    rmItemKey: string|null;                 // 삭제할 아이템 캐시 key 값
    
    // action
    getActiveKey: (                         // -- 라우터 키에 사용될 값 ----
        pathname: string,                   // 경로
        search: string|undefined            // GET Params
    ) => string;

    isChkCacheKey: (                        // -- 라우터에 관련 키가 있는지 확인 ----
        cacheKey: string                    // 캐시 키
    ) => [boolean, number];                 // 0: 키 여부, 1: index

    pageMove: (params: {                    // -- 페이지 이동 ----
        label: string;                      // 이동 할 탭의 라벨
        path: string;                       // 이동 할 탭의 경로
        type: itemType;                     // 탭 타입
    }) => void;

    tabClose: (                             // -- 탭 닫기 ----
        cacheKey: string                    // 닫을 탭 캐시 키 값
    ) => void;

    rmCacheKey: ()=>void;                   // -- 삭제 처리 된 캐시 키 값 제거 ----
}

// 테마 Store
export const useRouterStore = create<RouterState>((set, get) => ({
    list: [],
    currItem: null,
    rmItemKey: null,

    getActiveKey: (pathname, search='') => {
        return `${pathname}<,>${search}`;
    },

    isChkCacheKey: (cacheKey) => {
        const { list } = get();

        let i = -1;
        for( const item of list ){
            ++i;
            if( item.cacheKey === cacheKey ){ return [true, i]; }
        }
        return [false, -1];
    },

    pageMove: ({label, path, type}) => {
        const { getActiveKey, isChkCacheKey } = get();
        let { currItem, list } = get();

        // 활성화 할 키 값 가져오기
        const [pathname, search] = path.split('?', 2);
        const activeKey = getActiveKey(pathname, search);

        // 아이템 설정
        currItem = {
            cacheKey: activeKey,
            tabLabel: label,
            itemType: type,
            path,
        };

        //* 단순 이동
        if( type === 'move' ){
            // 값 설정
            set({
                currItem: {...currItem},
            });
        }
        //* 탭 관련
        else {
            const [is] = isChkCacheKey(activeKey);

            // 신규 탭이거나, 처음 추가하는 탭일 경우
            if( type === 'new-tab' || (type === 'tab' && !is) ){
                // 탭 추가
                list.push({...currItem});
            }

            // 값 설정
            set({
                list: [...list],
                currItem: {...currItem},
            });
        }
    },

    tabClose: (cacheKey) => {
        const { list, isChkCacheKey } = get();
        let { currItem } = get();

        // 라우터 내역이 없으면 처리 하지 않음
        if( list.length === 0 ){ return; }

        // 캐시 키 값이 있는지 확인
        const [is, idx] = isChkCacheKey(cacheKey);

        // 제거 값 이 없으면 끝
        if( !is ){ return; }

        // 삭제
        let rmItem: any = list.splice(idx, 1)[0];
        let setItems: any = {};

        // 활성화 된 메뉴를 닫을 경우, 다른 탭 활성화
        if( currItem?.cacheKey === rmItem?.cacheKey && list.length > 0 ){
            setItems['currItem'] = list[0];
            rmItem = null;
        }

        // 제거 할 캐시 키 값 등록
        set({
            list: [...list],
            rmItemKey: cacheKey,
            ...setItems
        });
    },

    rmCacheKey: () => {
        // 제거 처리 된 캐시 키 값 설정
        set({rmItemKey: null});
    }
}));