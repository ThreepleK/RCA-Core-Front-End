import { Input, type InputProps } from 'antd';

import style from './ui-input.module.css'

/**
 * Input 컴포넌트
 * https://ant.design/components/input
 */
export function UI_Input(props: InputProps){
    
    // Antd Input 기본 설정
    return <Input {...props} rootClassName={style['ui-input']} />
}