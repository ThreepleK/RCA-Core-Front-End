import type { ItemType, MenuItemType } from "antd/es/menu/interface";

/**
 * 속성에 ClassName 합치기
 * @param props 컴포넌트 속성
 * @param className 클래스명
 */
export function concatClassName(props: any, className?: string){
    const cn = !className ? '' : `${className} `;

    return ('className' in props && typeof props.className === 'string')
        ? `${cn}${props.className}`
        : cn;
}

/**
 * 속성에 RootClassName 합치기
 * @param props 컴포넌트 속성
 * @param className 클래스명
 */
export function concatRootClassName(props: any, className?: string){
    const cn = !className ? '' : `${className} `;

    return ('rootClassName' in props && typeof props.rootClassName === 'string')
        ? `${cn}${props.rootClassName}`
        : cn;
}

/**
 * Antd 메뉴 아이템 반복 처리 용
 * @param opts 
 * @param opts.menus      메뉴 데이터
 * @param opts.feedbackCB 해당 아이템 적용할지 여부 처리용 콜백
 */
export function menuLoop({ menus, feedbackCB }:{
    menus: ItemType[];
    feedbackCB: (item: MenuItemType) => boolean;
}){
    const loop = (items: any[]) => {
        const res = [];

        for( const item of items ){
            //* React의 불변성으로 얕은 복사 처리
            const nItem = { ...item };

            //* 서브 메뉴가 있으면
            if( 'children' in nItem ){
                // 하위 메뉴 필터링
                const children = loop(nItem.children as any[]);

                // 필터링 된 메뉴가 있으면 추가
                if( children.length > 0 ){
                    nItem.children = children;
                    res.push(nItem);
                }

                // 아래 라벨 검색 건너 뜀 (하위 메뉴가 없으면 의미 없음)
                continue;
            }

            // 구분 선 일때는 건너 뜀
            if( nItem?.type === 'divider' ){ continue; }
            
            //* 메뉴 결과
            if( feedbackCB(nItem) ){
                res.push(nItem);
            }
        }

        return res;
    }

    return loop(menus);
}