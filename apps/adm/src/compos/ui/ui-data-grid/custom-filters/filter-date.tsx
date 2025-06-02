import { useGridFilter, type CustomFilterProps } from "ag-grid-react";
import { useCallback, useMemo, useState } from "react";
import { UI_Button, UI_DatePicker } from "../..";

import style from "./filter-date.module.css";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";

export interface FilterDate extends CustomFilterProps {
}

/**
 * 날짜 필터
 */
export function FilterDate(props: FilterDate){
    const [isOpen, setIsOpen] = useState(false);
    const [date, setDate] = useState<Dayjs|null>(props.model ?? dayjs());

    //* 제어할 필드명 설정
    const field = useMemo(() => props.colDef.field, [props.colDef.field]);

    //* 그리드 필터 처리
    const doesFilterPass = useCallback((params) => {
        // 날짜까지만 같은지 확인
        return date.isSame(params.data[field], 'day');
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
     * @param date dayjs 기반 날짜
     * @param dateString 문자열 기반 날짜
     */
    const setChange = (date: Dayjs|null, dateString?: string) => {
        // null이 들어오면 초기 설정
        if( !date ){
            setDate(dayjs());
            props.onModelChange(null);
            return;
        }
        
        // 달력, 필터 실행
        setDate(date);
        props.onModelChange(date);
    };

    return <>
        <div className={style['filter-date']}>
            {/* 달력 */}
            <div>
                <UI_DatePicker
                    className={style['date-picker']}
                    size='small'
                    open={isOpen}
                    onOpenChange={setIsOpen}
                    onChange={setChange}
                    value={date}
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
