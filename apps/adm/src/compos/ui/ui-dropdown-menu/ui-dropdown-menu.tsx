import { useMemo } from 'react';
import { type DropdownProps } from 'antd';
import { concatClassName, concatRootClassName, menuLoop, UI_Button, UI_Dropdown } from '../index';
import { IconChevronDown } from '@tabler/icons-react';

import style from './ui-dropdown-menu.module.css'
import type { MenuItemType } from 'antd/es/menu/interface';

// 추가 기능 속성
export interface UiDropdownMenuProps extends DropdownProps {
    onClick?: (key: string) => void;        // 클릭 이벤트
}

/**
 * DropdownMenu 컴포넌트
 * @param onClick 클릭 이벤트
 */
export function UI_DropdownMenu(props: UiDropdownMenuProps){

    // ClassName 설정
    const rootCN = concatRootClassName(props, style['ui-dropdown-menu-root']);
    const cn = concatClassName(props, style['ui-dropdown-menu']);

    //* 메뉴 아이템 클릭 처리
    const onClick = (item: MenuItemType) => {
        if( !props?.onClick ){ return; }

        props.onClick(item.key as string);
    }

    // Dropdown 메뉴
    const menuData = useMemo(() => {
        const {menu} = props;

        // dropdown 스타일 변경
        return {items: ( menuLoop({
            menus: menu.items,
            feedbackCB: (item) => {
                const label = item.label as string;

                // 라벨에 적용
                item.label = <>
                    <div onClick={() => onClick(item)}>{label}</div>
                </>;

                return true;
            }})
        )} as any;
    }, [props?.menu]);

    // Dropdown 컴포넌트에 맞게 재설정
    const pureProps = useMemo(() => {
        const p = {...props};
        delete p.onClick;     // 클릭 이벤트 속성 제거
        return p;
    }, [props]);

    // Antd Button 기본 설정
    return (
        <UI_Dropdown {...pureProps}
            menu={menuData}
            rootClassName={rootCN}
            className={cn}
            trigger={['click']}
        >
            <UI_Button
                icon={<IconChevronDown size={14} />}
                iconPosition='end'
            >{props.children}</UI_Button>
        </UI_Dropdown>
    );
}