import { Tabs, type TabsProps } from 'antd';
import style from './ui-tabs.module.css'

/**
 * Tabs 컴포넌트
 * https://ant.design/components/upload
 */
export function UI_Tabs(props: TabsProps){
    
    // Antd Input 기본 설정
    return <Tabs {...props} rootClassName={style['ui-tabs']} />
}