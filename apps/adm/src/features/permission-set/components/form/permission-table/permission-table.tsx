import { useEffect, useState } from "react";
import type { TableProps } from "antd";
import { UI_Checkbox, UI_Table, UI_Title } from "@/compos/ui";

import { SectionStore } from '@/stores';

let pDataStore = new SectionStore<any>();

/**
 * 권한 테이블
 * todo.. 데이터 업데이트 수정 필요
 * @param title 제목
 * @param datas 테이블 데이터
 */
export function PermissionTable({ title, datas }: {
    title: string,
    datas: PermissionDataSets[],
}){
    console.log('datas', datas)
    const [src, setSrc] = useState(!datas ? [] : [...datas]);

    useEffect(() => {
        pDataStore.on('row-update', ({key, idx, value}) => {
            setSrc(prevSrc => prevSrc.map((r, i) => {
                if( idx === i ){
                    r[key] = value;
                }
                return r;
            }));
        });

        return () => {
            pDataStore.destroy();
            pDataStore = null;
        }
    }, []);

    return <>
        <UI_Title order={4}>{title}</UI_Title>
        <UI_Table
            columns={_COLUMNS as any}
            dataSource={src}
            pagination={false}
            size='small'
        />
    </>;
}

/**
 * 테이블 내에 사용 되는 체크박스
 */
function Chkbox({ row, rowKey, rowIdx }: {
    row: PermissionDataSets,
    rowKey: string,
    rowIdx: number,
}){
    const [value, setValue] = useState(row[rowKey]);

    const onClick = () => {
        const changeValue = !value;
        row[rowKey] = changeValue;
        setValue(changeValue);

        pDataStore.trigger('row-update', {
            key: rowKey,
            idx: rowIdx,
            value: changeValue
        });
    }

    return <UI_Checkbox
        type='primary'
        checked={value}
        onClick={onClick}
    />
}

type PermissionDataSets = {
    item: string;
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
}

const _COLUMNS: TableProps<PermissionDataSets>['columns'] = [
    {
        title: 'Item',
        dataIndex: 'item',
        key: 'item',
        render: (txt) => <>{txt}</>,
    },
    {
        title: 'View',
        dataIndex: 'view',
        key: 'view',
        align: 'center',
        width: 100,
        render: (is, record, idx) => <Chkbox
            row={record}
            rowIdx={idx}
            rowKey='view'
            key={`view-${idx}`}
         />,
    },
    {
        title: 'Create',
        dataIndex: 'create',
        key: 'create',
        align: 'center',
        width: 100,
        render: (is, record, idx) => <Chkbox
            row={record}
            rowIdx={idx}
            rowKey='create'
            key={`create-${idx}`}
        />,
    },
    {
        title: 'Edit',
        dataIndex: 'edit',
        key: 'edit',
        align: 'center',
        width: 100,
        render: (is, record, idx) => <Chkbox
            row={record}
            rowIdx={idx}
            rowKey='edit'
            key={`edit-${idx}`}
        />,
    },
    {
        title: 'Delete',
        dataIndex: 'delete',
        key: 'delete',
        align: 'center',
        width: 100,
        render: (is, record, idx) => <Chkbox
            row={record}
            rowIdx={idx}
            rowKey='delete'
            key={`delete-${idx}`}
        />,
    },
];