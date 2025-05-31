import { Flex, type FlexProps } from 'antd';

import style from './ui-flex.module.css'

/**
 * Flex 컴포넌트
 * https://ant.design/components/flex
 */
export function UI_Flex(props: FlexProps){

    // Antd Flex 기본 설정
    return <Flex {...props} rootClassName={style['ui-flex']} />
}