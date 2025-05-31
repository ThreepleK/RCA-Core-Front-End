import { Button, type ButtonProps } from 'antd';

import style from './ui-button.module.css'

/**
 * Button 컴포넌트
 * https://ant.design/components/button
 */
export function UI_Button(props: ButtonProps){
    // Antd Button 기본 설정
    return <Button {...props} rootClassName={style['ui-button']} />
}