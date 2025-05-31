import { Menu, type MenuProps } from 'antd';
import { menuLoop } from '../utils';

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

    // 메뉴 검색
    const menuData = useMemo(() => {
        const {searchKeyword, items} = props;

        // 검색 키워드가 있을 경우
        return ( searchKeyword
            ? menuLoop({
                menus: items,
                feedbackCB: (item) => {
                    const label = item.label as string;

                    //* 메뉴 라벨을 검색
                    if( RegExp(searchKeyword, 'i').test(label) ){

                        // 검색 키워드에 태그 추가
                        const sText = label.replace(
                            RegExp('(.+)?('+searchKeyword+')(.+)?', 'ig'),
                            '$1<b class="item-search">$2</b>$3'
                        );

                        // 라벨에 적용
                        item.label = <span
                            key={item.key}
                            dangerouslySetInnerHTML={{__html: sText}}
                        />;

                        return true;
                    }

                    // 검색 라벨이 없을 경우
                    return false;
                }
            })
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
    return <Menu {...pureProps} items={menuData} rootClassName={style['ui-menu']} />
}