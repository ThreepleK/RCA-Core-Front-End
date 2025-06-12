import { useGridFilter, type CustomFilterProps } from "ag-grid-react";
import { useCallback, useMemo, useState } from "react";
import { UI_Button, UI_DatePicker, UI_RangePicker } from "../..";

import style from "./filter-date-range.module.css";
import dayjs from "@/utils/dayjs";
import type { Dayjs } from "dayjs";

export interface FilterDateRange extends CustomFilterProps {
}

/**
 * 날짜 범위 필터
 */
export function FilterDateRange(props: FilterDateRange){
    const [isOpen, setIsOpen] = useState(false);
    const [dates, setDates] = useState<[Dayjs,Dayjs]|null>(props.model ?? [null, null]);

    //* 제어할 필드명 설정
    const field = useMemo(() => props.colDef.field, [props.colDef.field]);
    //* valueGetter 설정
    const valueGetter = useMemo(() => {
        return (props.colDef.valueGetter
            ? props.colDef.valueGetter as any
            : (params: any) => params.data[field]
        );
    }, [props.colDef.valueGetter]);

    //* 그리드 필터 처리
    const doesFilterPass = useCallback((params) => {
        const v = valueGetter(params);
        const target = dayjs(v).startOf('day');    // 시,분,초 제거

        // 해당 범위의 날짜인지 확인
        return target.isBetween(dates[0], dates[1], null, '[]');
    }, [props.model]);

    //* 필터가 닫힐 때 이벤트
    const afterGuiDetached = useCallback(() => {
        // 아직 DatePicker가 열려 있을 경우, 필터 다시 열기
        if( isOpen ){
            props.api.showColumnFilter(field);
        }
    }, [isOpen]);

    //* 그리드 필터 관련 설정
    useGridFilter({
        doesFilterPass,
        afterGuiDetached
    });

    /**
     * 변경 처리
     * @param dates dayjs 기반 날짜
     * @param dateString 문자열 기반 날짜
     */
    const setChange = (
        dates: [Dayjs,Dayjs]|null,
        dateStrings?: [string, string]
    ) => {
        // null이 들어오면 초기 설정
        if( !dates ){
            setDates([null, null]);
            props.onModelChange(null);
            return;
        }
        
        // 달력, 필터 실행
        setDates(dates);
        props.onModelChange(dates);
    };

    return <>
        <div className={style['filter-date-range']}>
            {/* 달력 */}
            <div>
                <UI_RangePicker
                    className={style['range-picker']}
                    size='small'
                    open={isOpen}
                    onOpenChange={setIsOpen}
                    onChange={setChange}
                    value={dates}
                    format={'YYYY-MM-DD'}
                />
            </div>

            {/* 버튼 */}
            <div className={style['btn-area']}>
                <UI_Button
                    size='small'
                    onClick={() => setChange(null)}
                >Reset</UI_Button>
            </div>
        </div>
    </>;
}
