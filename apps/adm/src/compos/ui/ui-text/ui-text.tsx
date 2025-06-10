import { Typography, type TypographyProps } from 'antd';

import style from './ui-text.module.css'

/**
 * Text 컴포넌트
 * https://ant.design/components/text
 */
export function UI_Text(props: any){
    const { Text } = Typography;
    // Antd Text 기본 설정
    return <Text {...props} rootClassName={style['ui-text']}>{props.text}</Text>
}