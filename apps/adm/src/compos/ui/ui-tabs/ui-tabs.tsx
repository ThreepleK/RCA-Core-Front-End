import { Tabs, type TabsProps } from 'antd';
import style from './ui-tabs.module.css'
import { concatRootClassName } from '../utils';

/**
 * Tabs 컴포넌트
 * https://ant.design/components/upload
 */
export function UI_Tabs(props: TabsProps){

    // 클래스 설정
    const rootCN = concatRootClassName(props, style['ui-tabs']);
    
    // Antd Input 기본 설정
    return <Tabs {...props} rootClassName={rootCN} />
}