import { Alert, type AlertProps } from 'antd';

import style from './ui-alert.module.css'

/**
 * Alert 컴포넌트
 * https://ant.design/components/alert
 */
export function UI_Alert(props: AlertProps){
    // Antd Alert 기본 설정
    return <Alert {...props} rootClassName={style['ui-alert']} />
}