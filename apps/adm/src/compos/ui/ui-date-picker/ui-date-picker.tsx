import { DatePicker, type DatePickerProps } from 'antd';

import style from './ui-date-picker.module.css'

/**
 * DatePicker 컴포넌트
 * https://ant.design/components/date-picker
 */
export function UI_DatePicker(props: DatePickerProps){
    
    // Antd DatePicker 기본 설정
    return <DatePicker {...props} rootClassName={style['ui-date-picker']} />
}