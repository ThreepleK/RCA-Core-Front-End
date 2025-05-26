import { TREE_ITEM, TREE_LIST } from '@/compos/ui/tree-editor'
import { v4 as uuidv4 } from 'uuid'

/**
 * 데이터 복제
 */
export function getDeepCp(data: any) {
    return JSON.parse(JSON.stringify(data ?? []));
}

/**
 * 트리 메뉴에서
 * Application 리스트만 가져오기
 */
export function getSelected_treeList(menuTree: TREE_LIST, selected: string|null): {
    label: string;
    allList: TREE_LIST;
}{
    // 트리 데이터 or 선택 된 항목이 없을 경우
    if( !menuTree || !selected ){
        return {
            label: '',
            allList: [],
        };
    }

    // Select된 리스트만 가져오기
    const treeList = menuTree.filter(item => item.id === selected);

    // 선택된 최상위 라벨 가져오기
    const { label } = treeList[0];

    // 결과 값 전달
    return {
        label,
        allList: treeList,
    };
}

/**
 * 트리 메뉴에서
 * Application 리스트만 가져오기
 */
export function getAppList(menuTree: TREE_LIST){
    if( !menuTree ){ return []; }

    // Select에 필요한 요소로 전달
    return menuTree.map(item => {
        return {
            label: String(item.label),
            value: String(item.id),
        };
    })
}

/**
 * DB raw → UI 메뉴 형태로
 */
export function dbRaw2Data(raw: DB_MENU_ITEM[]){
    if( !raw || raw.length === 0 ){ return []; }

    const loop = (items: DB_MENU_ITEM[], lv: number, pId: string|null = null) => {
        const res: TREE_LIST = [];

        for( const item of items ){
            // 관련 레벨이 아니면 건너 뜀
            if( item.level !== lv ){ continue; }
            // 부모 id와 맞지 않으면 건너 뜀
            if( pId !== null && item.parentMenuId !== pId ){ continue; }

            res.push({
                id: item.id,
                label: item.displayName,
                nodeProps: item,
                selected: false,
                children: lv < 4 ? loop(items, lv+1, item.id) : [],
            });
        }

        return res;
    }

    const result = loop(raw, 1, null);

    return result;
}

/**
 * UI 메뉴 → DB raw 형태로
 */
export function data2DbRaw(data: TREE_LIST, rootItem: TREE_ITEM|null){
    if( !data || data.length === 0 ){ return []; }
    
    //* 결과 값
    const res: DB_MENU_ITEM[] = [];

    //* 최상위 root 아이템
    const rootUpdate = ( item: any ) => {
        // DB에서 넘어온 데이터
        return item.nodeProps as DB_MENU_ITEM;
    }

    //* 업데이트 아이템
    const updateItem = ( item: any, lv: number, pId: string|null, order: number) => {
        // DB에서 넘어온 데이터
        const rawData = item.nodeProps as DB_MENU_ITEM;

        rawData.displayName = item.label;   // 변경된 이름 가져오기
        rawData.level = lv;                 // 변경된 하위 depth 설정
        rawData.sortOrder = order;          // 정렬 순서

        // 아이템 타입 ('update': 수정, '': 원본)
        rawData['itemType'] = 'itemType' in item ? 'update' : '';

        // 부모 id가 있으면 설정
        if( pId !== null ){
            rawData.parentMenuId = pId;
        }

        return rawData;
    }

    //* 신규 아이템
    const newItem = ( item: any, lv: number, pId: string|null, order: number) => {
        const target = item as TREE_ITEM;
        const props = target?.nodeProps;

        const parentMenuId = pId === null && lv === 2
            ? (rootItem === null ? '' : rootItem.id)
            : pId;

        return {
            displayName: target.label,                  // 메뉴 이름
            level: lv,                                  // 메뉴 depth
            sortOrder: order,                           // 메뉴 정렬순서
            parentMenuId,                               // 메뉴 부모 id
            id: item.id,                                // 메뉴 아이디
            name: uuidv4(),                             // 메뉴 이름
            url: props?.url ?? '',                      // 링크
            openNewTab: props?.openNewTab ?? false,     // 신규 탭 여부
            isVisible: props?.isVisible ?? false,       // 메뉴 활성화 여부
            isActive: props?.isActive ?? false,         // 메뉴 기능 여부
            itemType: 'new',                            // 신규 메뉴
        } as DB_MENU_ITEM;
    }

    //* 반복
    const loop = (items: TREE_LIST, lv: number, pId: string|null = null ) => {
        items.forEach((item, idx) => {
            const order = idx;  // 정렬 순서 (0이 아닌 1부터)
            
            // 신규 아이템
            if( item?.itemType === 'new' ){
                res.push( newItem(item, lv, pId, order) );
            }
            // 업데이트 될 아이템
            else {
                res.push( updateItem(item, lv, pId, order) );
            }

            // 하위 항목 
            if( item.children ){
                loop(item.children, lv+1, String(item.id));
            }
        });
    }

    // 최상위 루트 아이템 아래 부터 시작이여서 lv2 부터
    loop(data, 2, null);

    // 최상위 루트 아이템 가져오기
    const parentItem = rootUpdate(rootItem);

    // 데이터 전달
    return [parentItem, ...res];
}

/**
 * 원본 DB데이터와 편집된 raw 데이터 합치기
 */
export function dbRawContainData(editRaw: DB_MENU_ITEM[], srcRaw: DB_MENU_ITEM[]){
    
    // 부모 -> 자식 순으로 아이템 정렬
    const getConnectedItemsSort = (items: DB_MENU_ITEM[]) => {
        const parentMap = new Map();
      
        // parentId 기준으로 자식들을 정리
        for (const item of items) {
            const list = parentMap.get(item.parentMenuId) || [];
            list.push(item);
            parentMap.set(item.parentMenuId, list);
        }
      
        const result = new Set();
      
        // 루트부터 재귀적으로 자식들 수집
        function traverse(node: any) {
            if (result.has(node)) return;
            result.add(node);
            for (const child of parentMap.get(node.id) || []) {
                traverse(child);
            }
        }
      
        for (const root of parentMap.get(null) || []) {
            traverse(root);
        }
      
        return [...result] as DB_MENU_ITEM[];
    }

    // 편집된 raw 데이터에서 부모 id만 추려오기
    const searchIds = editRaw.filter(item => item.parentMenuId === null).map(item => item.id);

    // 원본 데이터를 부모 → 자식 순으로 데이터 정렬
    const sortRawData = getConnectedItemsSort(srcRaw);

    // 필요한 원본 데이터만 가져오기
    const filterData: DB_MENU_ITEM[] = [];

    let pId = '';
    for( const rawItem of sortRawData ){
        // 최상위 아이템의 id 설정
        if( rawItem.parentMenuId === null && pId !== rawItem.id ){
            pId = rawItem.id;
        }

        // 제외 할 대상이면 건너 뜀
        if( searchIds.includes(pId) ){ continue; }

        // 살려야 할 대상일 경우 추가
        filterData.push(rawItem);
    }

    // 팔요한 원본 데이터 + 편집 데이터 합치기
    const result = [...filterData, ...editRaw];
    
    return result;
}

//* DB에서 넘어올 임시 데이터 포맷
export interface DB_MENU_ITEM {
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
                                    // ----- 추후 아이템 등록 시 사용 될 항목
    itemType?: 'new'|'update'|'';   // 아이템 타입 new: 신규 / update: 수정
}