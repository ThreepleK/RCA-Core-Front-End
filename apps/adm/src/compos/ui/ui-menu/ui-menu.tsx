import { Menu, type MenuProps } from 'antd';

import style from './ui-menu.module.css'

export function UI_Menu(props: MenuProps){
    // ClassName 설정
    const className = ('className' in props)
        ? `${style['ui-menu']} ${props.className}`
        : style.input
    ;
    
    // Antd Input 기본 설정
    return <Menu {...props} className={className} />
}