import { Radio, type RadioGroupProps } from 'antd';

import style from './ui-radio.module.css'

/**
 * Radio 컴포넌트
 * https://ant.design/components/radio
 */
export function UI_Radio(props: RadioGroupProps){
    // Antd Radio 기본 설정
    return <Radio.Group {...props} rootClassName={style['ui-radio']} />
}