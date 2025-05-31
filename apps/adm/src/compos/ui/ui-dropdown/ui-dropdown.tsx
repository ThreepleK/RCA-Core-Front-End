import { Dropdown, type DropdownProps } from 'antd';

import { concatClassName, concatRootClassName } from '../utils';
import style from './ui-dropdown.module.css'

/**
 * Dropdown 컴포넌트
 * https://ant.design/components/dropdown
 */
export function UI_Dropdown(props: DropdownProps){

    // 클래스 설정
    const rootCN = concatRootClassName(props, style['ui-dropdown-root']);
    const cn = concatClassName(props, style['ui-dropdown']);

    // Antd Button 기본 설정
    return <Dropdown {...props} className={cn} rootClassName={rootCN} />
}