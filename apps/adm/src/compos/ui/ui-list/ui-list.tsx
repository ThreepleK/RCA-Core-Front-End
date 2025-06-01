import { List, type ListProps } from 'antd';

import { concatClassName, concatRootClassName } from '../utils';
import style from './ui-list.module.css'
import type { ListItemProps } from 'antd/es/list';

/**
 * List 컴포넌트
 */
export function UI_List<T>(props: ListProps<T>){

    // ClassName 설정
    const rootCN = concatRootClassName(props, style['ui-select-root']);
    const cn = concatClassName(props, style['ui-select']);
    
    // Antd Select 기본 설정
    return <List {...props} rootClassName={rootCN} className={cn} />
}

/**
 * List 아이템 컴포넌트
 */
export function UI_ListItem(props: ListItemProps){

    // Antd Select 기본 설정
    return <List.Item {...props} />
}