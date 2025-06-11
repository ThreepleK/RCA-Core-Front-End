import { Checkbox, type CheckboxProps } from 'antd';

import { concatClassName, concatRootClassName } from '../utils';
import style from './ui-checkbox.module.css'

/**
 * Checkbox 컴포넌트
 * https://ant.design/components/checkbox
 */
export function UI_Checkbox(props: CheckboxProps){

    // 클래스 설정
    const rootCN = concatRootClassName(props, style['ui-checkbox-root']);
    const cn = concatClassName(props, style['ui-checkbox']);

    // Antd Checkbox 기본 설정
    return <Checkbox {...props} className={cn} rootClassName={rootCN} />
}