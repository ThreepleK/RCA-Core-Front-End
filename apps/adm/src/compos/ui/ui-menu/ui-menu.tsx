import { Menu, type MenuProps } from 'antd';
import { concatClassName } from '../utils';

import style from './ui-menu.module.css'
import { useMemo } from 'react';
import type { MenuItemType } from 'antd/es/menu/interface';

// 메뉴 데이터 포맷
export type MenuItem = Required<MenuProps>['items'][number];

// 추가 기능 속성
export interface UiMenuProps extends MenuProps {
    searchKeyword?: string;      // 검색어
}

/**
 * Menu 컴포넌트
 * https://ant.design/components/menu
 */
export function UI_Menu(props: UiMenuProps){
    // ClassName 설정
    const className = concatClassName(props, style['ui-menu']);

    // 메뉴 검색
    const menuData = useMemo(() => {
        const loop = (items: any[], search: string) => {
            const res = [];

            for( const item of items ){
                //* React의 불변성으로 얕은 복사 처리
                const nItem = { ...item };

                //* 서브 메뉴가 있으면
                if( 'children' in nItem ){
                    // 하위 메뉴 필터링
                    const children = loop(nItem.children as any[], search);

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
                
                //* 메뉴 라벨을 검색
                if( RegExp(search, 'i').test(nItem.label) ){

                    // 검색 키워드에 태그 추가
                    const sText = nItem.label.replace(
                        RegExp('(.+)?('+search+')(.+)?', 'ig'),
                        '$1<b class="item-search">$2</b>$3'
                    );

                    // 라벨에 적용
                    nItem.label = <span
                        key={nItem.key}
                        dangerouslySetInnerHTML={{__html: sText}}
                    />;

                    res.push(nItem);
                }
            }

            return res;
        }

        const {searchKeyword, items} = props;

        // 검색 키워드가 있을 경우
        return (
            searchKeyword
                ? loop(items, searchKeyword)
                : items
        ) as MenuItemType[];
    }, [props?.searchKeyword]);

    // Menu 컴포넌트에 맞게 재설정
    const pureProps = useMemo(() => {
        const p = {...props};
        delete p.searchKeyword;     // 검색어 속성 제거
        return p;
    }, [props]);
    
    // Antd Input 기본 설정
    return <Menu {...pureProps} items={menuData} className={className} />
}