import { Input, type InputProps } from 'antd';
import { concatClassName } from '../utils';

import style from './ui-input.module.css'

export function UI_Input(props: InputProps){
    // ClassName 설정
    const className = concatClassName(props, style['ui-input']);
    
    // Antd Input 기본 설정
    return <Input {...props} className={className} />
}