import {
    FilterSelect, FilterMultiSelect, FilterRange,
    FilterDate, FilterDateRange
} from './custom-filters';
import type { ColDef } from './';

/**
 * [Filter] 텍스트
 */
export function f_text() {
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


//* 필터 모음
export const columnFilters = {
    text: f_text,
    select: f_select,
    multiSelect: f_multiSelect,
    range: f_range,
    date: f_date,
    dateRange: f_dateRange,
};