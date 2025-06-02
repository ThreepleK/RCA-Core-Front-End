import { type ReactNode, useEffect, useState } from 'react';
import { IconCalendar } from '@tabler/icons-react';

import dayjs from '@/utils/dayjs';
// import style from './data-grid-filter.module.css'
import type { ColDef } from './';
import { FilterSelect, FilterMultiSelect, FilterRange, FilterDate } from './custom-filters';
import { FilterDateRange } from './custom-filters/filter-date-range';

/**
 * [Filter] 텍스트
 * @param opts 텍스트 필터 옵션
 */
export function f_text(opts: {
}) {
    return {
        filter: 'agTextColumnFilter',
        filterParams: {
            buttons: ['reset', 'apply'],    // 필터에 사용될 버튼
            filterOptions: [                // 필터 조건에 사용될 옵션
                'contains',                 // 검색 키워드랑 관련된
                'notContains',              // 검색 키워드랑 관련되지 않은
            ],
        }
    } as ColDef;
}

/**
 * [Filter] Select
 * @param opts Select 옵션
 * @param opts.data 필터에 보여줄 내역
 */
export function f_select(opts: {
    data: {label: string, value: string}[],
}) {
    return {
        filter: FilterSelect,
        filterParams: opts,
    } as ColDef;
}

/**
 * [Filter] 멀티 Select
 * @param opts 멀티 Select 옵션
 * @param opts.data 필터에 보여줄 내역
 */
export function f_multiSelect(opts: {
    data: {label: string, value: string}[],
}) {
    return {
        filter: FilterMultiSelect,
        filterParams: opts,
    } as ColDef;
}

/**
 * [Filter] 범위
 * @param defaultMin [기본 값] 범위 최소 값
 * @param defaultMax [기본 값] 범위 최대 값
 */
export function f_range(
    defaultMin?: number,
    defaultMax?: number,
) {
    return {
        filter: FilterRange,
        filterParams: {
            min: defaultMin,
            max: defaultMax,
        },
    } as ColDef;
}

/**
 * [Filter] 날짜
 */
export function f_date() {
    return {
        filter: FilterDate,
        filterParams: {},
    } as ColDef;
}

/**
 * [Filter] 날짜 범위 선택
 */
export function f_dateRange() {
    return {
        filter: FilterDateRange,
        filterParams: {},
    } as ColDef;
}


// /**
//  * [Filter] 날짜 범위 선택
//  * @param opts 날짜 선택 옵션
//  * @param opts.accessorKey 필터에 사용될 컬럼 키 값
//  * @param opts.dateFormat 날짜 포맷 (기본: YYYY-MM-DD)
//  */
// export function f_dateRange(opts: {
//     accessorKey: string,
//     dateFormat?: dayjs.OptionType,
// }) {
//     return {
//         filterVariant: 'date-range',
//         ...commDate(opts),
//     } as COLUMN_ITEM;
// }

// /**
//  * [Filter] 액션 버튼 전용
//  * @param opts
//  * @param opts.id 액션컬럼에 사용될 id 값
//  * @param opts.label 액션컬럼에 사용될 라벨
//  * @param opts.buttons 버튼 모음
//  * @param opts.feedback 버튼 클릭 이벤트
//  */
// export function f_actionButtons(opts: {
//     id?: string;
//     label?: string;
//     buttons: {[key: string]: string|ReactNode};
//     feedback: (btnKey: string, row: MRT_Row<any>) => void;
// }){
//     return {
//         id: opts.id ?? 'actions',
//         header: opts.label ?? 'Actions',
//         enableColumnOrdering: false,
//         enableSorting: false,
//         enableEditing: false,
//         Cell: (props) => {
//             const res = [];

//             // 버튼 갯수만큼 생성
//             for( const key in opts.buttons ){
//                 const btn = opts.buttons[key];

//                 res.push(
//                     <UnstyledButton key={key} onClick={(e) => {
//                         e.stopPropagation();                  // row 클릭 방지
//                         opts.feedback(key, props.cell.row);   // 클릭 이벤트 전달
//                     }}>{btn}</UnstyledButton>
//                 );
//             }

//             // 셀에 전달
//             return <Flex gap='xs' justify='flex-start' align='center'>{res}</Flex>;
//         },
//     } as COLUMN_ITEM;
// }


//* 필터 모음
export const columnFilters = {
    text: f_text,
    select: f_select,
    multiSelect: f_multiSelect,
    range: f_range,
    date: f_date,
    dateRange: f_dateRange,
    // actionBtns: f_actionButtons,
}