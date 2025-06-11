import { Table, type TableProps } from 'antd';

import style from './ui-table.module.css'

/**
 * Table 컴포넌트
 * https://ant.design/components/table
 */
export function UI_Table(props: TableProps){
    // Antd Table 기본 설정
    return <Table {...props} rootClassName={style['ui-table']} />
}