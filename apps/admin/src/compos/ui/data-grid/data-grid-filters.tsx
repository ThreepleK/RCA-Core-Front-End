import { useEffect, useState } from 'react';
import { MRT_ColumnDef } from 'mantine-react-table';
import { ComboboxData, TextInput, ComboboxStringData } from "@mantine/core";
import { IconCalendar } from '@tabler/icons-react';

import dayjs from '@/utils/dayjs';

// 그리드 컬럼 Item
export type COLUMN_ITEM = MRT_ColumnDef<any>;

/**
 * [Filter] 자동완성
 * @param opts 자동완성 옵션션
 * @param opts.data 자동완성에 사용될 데이터
 * @param opts.limit 자동완성으로 보여줄 최대 갯수 설정 (기본: 5줄)
 * @param opts.maxHeight 자동완성 dropdown 최대 높이 설정 (기본: 200px)
 */
export function f_autocomplete(opts: {
    data?: ComboboxStringData,
    limit?: number,
    maxHeight?: number,
}) {
    return {
        filterVariant: 'autocomplete',
        mantineFilterAutocompleteProps: {
            data: opts.data,
            clearable: true,
            limit: opts.limit ?? 5,
            maxDropdownHeight: opts.maxHeight ?? 200,
        }
    } as COLUMN_ITEM;
}

/**
 * [Filter] Select
 * @param opts Select 옵션
 * @param opts.data 필터에 보여줄 내역
 */
export function f_select(opts: {
    data?: ComboboxData
}) {
    return {
        filterVariant: 'select',
        mantineFilterSelectProps: {
            data: opts.data
        }
    } as COLUMN_ITEM;
}

/**
 * [Filter] 멀티 Select
 * @param opts 멀티 Select 옵션
 * @param opts.data 필터에 보여줄 내역
 */
export function f_multiSelect(opts: {
    data?: ComboboxData
}) {
    return {
        filterVariant: 'multi-select',
        mantineFilterSelectProps: {
            data: opts.data
        }
    } as COLUMN_ITEM;
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
        filterVariant: 'range',
        Filter: (props) => {
            const {column, rangeFilterIndex: rangeIdx} = props;
            const [value, setValue] = useState('');

            //* 초기 설정
            useEffect(() => {
                // min 설정
                if( rangeIdx === 0 && typeof defaultMin === 'number' ){
                    setValue(defaultMin+'');
                }
                // max 설정
                else if( rangeIdx === 1 && typeof defaultMax === 'number' ){
                    setValue(defaultMax+'');
                }
            }, []);

            //* min/max 적용
            useEffect(() => {
                column.setFilterValue((old: number[]|undefined) => {
                    const res = new Array(2);

                    // min/max로 사용될 index 설정
                    const currIdx = rangeIdx;
                    const diffIdx = ( currIdx === 0 ? 1 : 0 );

                    // 변경된 min/max 값 적용
                    res[currIdx] = Number(value);
                    res[diffIdx] = old === undefined ? undefined : old[diffIdx];

                    return res;
                });
            }, [value]);

            return <TextInput placeholder="Min" type="number" value={value}
                onChange={(e) => setValue(e.target.value.trim())}
            />;
        }
    } as COLUMN_ITEM;
}

/**
 * [Filter] 범위 슬라이더
 * @param opts 슬라이더 옵션
 * @param opts.min 슬라이더 범위 최소 값
 * @param opts.max 슬라이더 범위 최대 값
 * @param opts.step 슬라이더 1칸당 움직임
 */
export function f_rangeSlider(opts: {
    min?: number,
    max?: number,
    step?: number
}) {
    return {
        filterVariant: 'range-slider',
        mantineFilterRangeSliderProps: {
            min: opts.min,
            max: opts.max,
            step: opts.step,
        }
    } as COLUMN_ITEM;
}

/**
 * [Filter] 체크박스
 * (true/false 형태의 데이터에서 사용)
 * @param opts 체크박스 옵션
 * @param opts.matchValues 선택, 미선택, 기타에 대한 컬럼에 보여줄 값 설정
 * @param opts.matchValues.true 데이터가 true일 때 보여줄 값
 * @param opts.matchValues.false 데이터가 false일 때 보여줄 값
 * @param opts.matchValues.etc 데이터가 true/false외 보여줄 값 (기본:'-')
 * @param opts.label 체크박스에 보여질 라벨
 * @param opts.defaultChecked 기본 체크 여부
 */
export function f_chkBox(opts: {
    matchValue: {
        true: string;
        false: string;
        etc: string;
    };
    label?: string;
    defaultChecked?: boolean;
}) {
    return {
        filterVariant: 'checkbox',
        mantineFilterCheckboxProps: {
            label: opts.label ?? '',
            defaultChecked: opts.defaultChecked,
        },
        Cell: ({ cell }) => {
            const { matchValue } = opts;
            // 셀에서 사용되는 값 가져오기
            const v = cell.getValue() as boolean;

            // 실제 매핑해야될 형태로 변환
            const changeKey = (v === true)
                ? 'true'
                : (v === false ? 'false' : '-');

            // 매핑 데이터 전달
            return matchValue[changeKey];
        }
    } as COLUMN_ITEM;
}

/**
 * [날짜 선택]
 * 공통 설정 값
 * @param opts 날짜 선택 옵션
 * @param opts.accessorKey 필터에 사용될 컬럼 키 값
 * @param opts.dateFormat 날짜 포맷 (기본: YYYY-MM-DD)
 */
function commDate(opts: {
    accessorKey: string,
    dateFormat?: dayjs.OptionType,
}){
    // 설정된 날짜 포맷이 없으면 기본 값 설정
    const dateFormat = !opts.dateFormat ? 'YYYY-MM-DD' : opts.dateFormat;

    return {
        //* mantine DateInput 속성 설정
        mantineFilterDateInputProps: {
            rightSection: <IconCalendar size={20} strokeWidth={1.5} style={{pointerEvents: 'none'}} />,
            monthLabelFormat: 'YYYY. MM',
            valueFormat: dateFormat,
        },
        //* 데이터 초기 설정
        accessorFn: (row) => {
            const { accessorKey, dateFormat } = opts;

            // 관련 컬럼 키 값이 아닐 경우 표기될 값
            if( !(accessorKey in row) ){ return null; }

            // dayjs형태로 날짜 변환 (포맷 형태의 데이터)
            return dayjs(row[accessorKey], dateFormat).toDate();
        },
        //* 그리드에 보여질 셀 값 표기용
        Cell: ({ cell }) => {
            const v = cell.getValue<Date>();
            return v ? dayjs(v).format(dateFormat as string) : '-';
        },
    } as COLUMN_ITEM;
}

/**
 * [Filter] 날짜 선택
 * @param opts 날짜 선택 옵션
 * @param opts.accessorKey 필터에 사용될 컬럼 키 값
 * @param opts.dateFormat 날짜 포맷 (기본: YYYY-MM-DD)
 */
export function f_date(opts: {
    accessorKey: string,
    dateFormat?: dayjs.OptionType,
}) {
    return {
        filterVariant: 'date',
        ...commDate(opts),
    } as COLUMN_ITEM;
}

/**
 * [Filter] 날짜 범위 선택
 * @param opts 날짜 선택 옵션
 * @param opts.accessorKey 필터에 사용될 컬럼 키 값
 * @param opts.dateFormat 날짜 포맷 (기본: YYYY-MM-DD)
 */
export function f_dateRange(opts: {
    accessorKey: string,
    dateFormat?: dayjs.OptionType,
}) {
    return {
        filterVariant: 'date-range',
        ...commDate(opts),
    } as COLUMN_ITEM;
}


//* 필터 모음
export const columnFilters = {
    auto: f_autocomplete,
    select: f_select,
    multiSelect: f_multiSelect,
    range: f_range,
    rangeSlider: f_rangeSlider,
    chkbox: f_chkBox,
    date: f_date,
    dateRange: f_dateRange,
}