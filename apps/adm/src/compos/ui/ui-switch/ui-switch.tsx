import { Switch, type SwitchProps } from 'antd';

import style from './ui-switch.module.css'

/**
 * Switch 컴포넌트
 * https://ant.design/components/switch
 */
export function UI_Switch(props: SwitchProps){
    // Antd Switch 기본 설정
    return <Switch {...props} rootClassName={style['ui-switch']} />
}