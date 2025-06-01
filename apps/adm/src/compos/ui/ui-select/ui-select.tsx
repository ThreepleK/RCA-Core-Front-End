import { Select, type SelectProps } from 'antd';

import { concatClassName, concatRootClassName } from '../utils';
import style from './ui-select.module.css'

/**
 * Select 컴포넌트
 * https://ant.design/components/select
 */
export function UI_Select(props: SelectProps){

    // ClassName 설정
    const rootCN = concatRootClassName(props, style['ui-select-root']);
    const cn = concatClassName(props, style['ui-select']);
    
    // Antd Select 기본 설정
    return <Select {...props} rootClassName={rootCN} className={cn} />
}