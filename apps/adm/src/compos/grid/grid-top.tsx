import { UI_Button, UI_Input } from '../ui';
import type { GridApi } from "ag-grid-community";

import { useCallback, useEffect, useState } from 'react';
import { IconDeselect, IconFilterOff, IconReorder, IconRestore, IconSearch } from '@tabler/icons-react';

import style from './grid-basic.module.css'

export function GridTop({ getGridApi, connector }: {
    getGridApi: () => GridApi<any>,
    connector: (
        conn: (key: string, val?: any) => void
    ) => void,
}){
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState('');

    const [isFilter, setIsFilter] = useState(true);
    const [isChecked, setIsChecked] = useState(true);
    const [isSort, setIsSort] = useState(true);

    //* 그리드에서 전달 받은 이벤트
    useEffect(() => {
        const conn = (key: string, val?: any) => {
            const api = getGridApi();

            switch( key ){
                // 로드
                case 'onLoad': {
                    setTotal(val as number);
                } break;
                // 필터 변경 이벤트
                case 'onFilterChange': {
                    const filterLen = Object.keys(api.getFilterModel()).length;
                    setIsFilter(filterLen === 0);
                } break;
                // 정렬 이벤트
                case 'onSortChange': {
                    const sorted = api.getState().sort;
                    setIsSort(sorted === undefined);
                } break;
                // row 선택 이벤트
                case 'onRowSelected': {
                    const rowLen = api.getSelectedRows().length;
                    setIsChecked(rowLen === 0);
                } break;
            }
        };

        // Grid랑 연결
        connector(conn);
    }, []);

    //* 초기화, 체크 해제, 필터 해제
    const onFuncCall = useCallback((key: string) => {
        const api = getGridApi();

        switch(key){
            //* 적용한 조건 전부 제거
            case 'reset': {
                api.deselectAll();
                api.setFilterModel(null);
                api.applyColumnState({
                    defaultState: { sort: null },
                    applyOrder: true
                });

                if( !search ){
                    setSearch('');
                    setTimeout(onSearch, 10);
                }
            } break;

            //* 정렬 전체 취소 
            case 'unSortAll': {
                api.applyColumnState({
                    defaultState: { sort: null },
                    applyOrder: true
                });
            } break;

            //* 선택 row 전체 해제
            case 'unCheckAll': api.deselectAll(); break;
            //* 필터 전체 해제
            case 'unFilterAll': api.setFilterModel(null); break;
        }
    }, []);

    //* 검색
    const onSearch = useCallback(() => {
        const api = getGridApi();
        api.setGridOption('quickFilterText', search);
    }, [search]);
    
    return <>
        <ul className={style['grid-top']}>
            {/* 좌측 총 갯수 */}
            <li className={style['gt-left']}>
                <span>Total: {total}</span>
            </li>

            {/* 우측 기능 버튼 */}
            <li className={style['gt-right']}>
                {/* 리셋 버튼 */}
                <UI_Button
                    size='small'
                    disabled={isFilter&&isChecked&&isSort&&(!search)}
                    onClick={() => onFuncCall('reset')}
                ><IconRestore size={15} strokeWidth={1.2} /></UI_Button>

                {/* 체크 해제 버튼 */}
                <UI_Button
                    size='small'
                    disabled={isChecked}
                    onClick={() => onFuncCall('unCheckAll')}
                ><IconDeselect size={15} strokeWidth={1.2} /></UI_Button>

                {/* 소팅 해제 버튼 */}
                <UI_Button
                    size='small'
                    disabled={isSort}
                    onClick={() => onFuncCall('unSortAll')}
                ><IconReorder size={15} strokeWidth={1.2} /></UI_Button>

                {/* 필터 해제 버튼 */}
                <UI_Button
                    size='small'
                    disabled={isFilter}
                    onClick={() => onFuncCall('unFilterAll')}
                ><IconFilterOff size={15} strokeWidth={1.2} /></UI_Button>

                {/* 검색 */}
                <UI_Input
                    value={search}
                    size='small'
                    placeholder="search..."
                    onChange={(event) => setSearch(event.currentTarget.value)}
                    onKeyUp={(e) => { if(e.keyCode === 13){ onSearch(); } }}
                    addonAfter={
                        <IconSearch size={15} strokeWidth={1.2} onClick={onSearch} />
                    }
                />
            </li>
        </ul>
    </>;
}