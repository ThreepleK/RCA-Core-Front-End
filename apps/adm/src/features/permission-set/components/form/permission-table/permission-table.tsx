import { useEffect, useMemo, useState } from "react";
import type { TableProps } from "antd";
import { UI_Checkbox, UI_Table, UI_Title } from "@/compos/ui";

import { SectionStore } from '@/stores';
import type { PermissionTableItem } from "../form-create-content";

// PermissionTable와 Chkbox 연동을 위한 store (권한 업데이트 용)
let _pDataStore: SectionStore<any> = null;

/**
 * 권한 테이블
 * todo.. 데이터 업데이트 수정 필요
 * @param title 제목
 * @param datas 테이블 데이터
 * @param onUpdate 테이블 내용 변경 이벤트
 */
export function PermissionTable({ title, datas, onUpdate }: {
    title: string,
    datas: PermissionTableItem[],
    onUpdate: (row: PermissionTableItem[]) => void
}){
    const [src, setSrc] = useState(!datas ? [] : [...datas]);

    useEffect(() => {
        if( !_pDataStore ){
            _pDataStore = new SectionStore<any>()
        }

        // 체크박스 항목 업데이트
        _pDataStore.on('row-update', ({key, idx, value}) => {
            setSrc(prevSrc => {
                // setSrc 업데이트
                const updateData = prevSrc.map((r, i) => {
                    if( idx === i ){
                        r[key] = value;
                    }
                    return r;
                });
                
                // 부모 컴포넌트에 내용 전달
                onUpdate(updateData);

                // src 데이터 반영
                return updateData;
            });
        });

        return () => {
            if( _pDataStore ){
                _pDataStore.destroy();
                _pDataStore = null;
            }
        }
    }, []);

    return <>
        <UI_Title order={4}>{title}</UI_Title>
        <UI_Table
            columns={_COLUMNS as any}
            dataSource={src}
            pagination={false}
            size='small'
            rowKey='id'
        />
    </>;
}

/**
 * 테이블 내에 사용 되는 체크박스
 */
function Chkbox({ row, rowKey, rowIdx }: {
    row: PermissionTableItem,
    rowKey: string,
    rowIdx: number,
}){
    const [value, setValue] = useState(row[rowKey]);
    const disabled = useMemo(() => row.isDisable, [row.isDisable]);

    //* 체크박스 선택
    const onClick = () => {
        // 선택 값 뒤집기
        const changeValue = !value;

        // 테이블 row에 관련 항목 (View, Create, Edit, Delete) 업데이트
        row[rowKey] = changeValue;
        // 체크박스 값 수정
        setValue(changeValue);

        // PermissionTable에 변경 내용 전달
        _pDataStore.trigger('row-update', {
            key: rowKey,
            idx: rowIdx,
            value: changeValue
        });
    }

    return <UI_Checkbox
        type='primary'
        checked={value}
        onClick={onClick}
        disabled={disabled}
    />
}

const _COLUMNS: TableProps<PermissionTableItem>['columns'] = [
    {
        title: 'Item',
        dataIndex: 'item',
        key: 'item',
        render: (txt) => <>{txt}</>,
    },
    {
        title: 'View',
        dataIndex: 'readable',
        key: 'readable',
        align: 'center',
        width: 120,
        render: (is, record, idx) => <Chkbox
            row={record}
            rowIdx={idx}
            rowKey='readable'
            key={`readable-${idx}`}
        />,
    },
    {
        title: 'Create',
        dataIndex: 'creatable',
        key: 'creatable',
        align: 'center',
        width: 120,
        render: (is, record, idx) => <Chkbox
            row={record}
            rowIdx={idx}
            rowKey='creatable'
            key={`creatable-${idx}`}
        />,
    },
    {
        title: 'Edit',
        dataIndex: 'updatable',
        key: 'updatable',
        align: 'center',
        width: 120,
        render: (is, record, idx) => <Chkbox
            row={record}
            rowIdx={idx}
            rowKey='updatable'
            key={`updatable-${idx}`}
        />,
    },
    {
        title: 'Delete',
        dataIndex: 'deletable',
        key: 'deletable',
        align: 'center',
        width: 120,
        render: (is, record, idx) => <Chkbox
            row={record}
            rowIdx={idx}
            rowKey='deletable'
            key={`deletable-${idx}`}
        />,
    },
];