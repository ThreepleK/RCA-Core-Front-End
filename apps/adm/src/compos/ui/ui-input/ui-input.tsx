import { Input, type InputProps } from 'antd';

import style from './ui-input.module.css'

export function UI_Input(props: InputProps){
    // ClassName 설정
    const className = ('className' in props)
        ? `${style['ui-input']} ${props.className}`
        : style.input
    ;
    
    // Antd Input 기본 설정
    return <Input {...props} className={className} />
}