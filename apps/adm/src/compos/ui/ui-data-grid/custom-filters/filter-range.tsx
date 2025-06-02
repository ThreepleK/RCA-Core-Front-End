import { useGridFilter, type CustomFilterProps } from "ag-grid-react";
import { useCallback, useMemo, useState } from "react";
import { UI_Button, UI_Flex, UI_Slider } from "../..";

import style from "./filter-range.module.css";

export interface FilterRange extends CustomFilterProps {
    min: number,    // 최소 범위
    max: number,    // 최대 범위
}

/**
 * 범위 필터
 */
export function FilterRange(props: FilterRange){
    const [range, setRange] = useState<number[]|null>(
        props.model ?? [props.min, props.max]
    );

    //* Slider에 보여줄 마커 위치
    const marks = useMemo(() => {
        const res = {};
        res[props.min] = props.min;
        res[props.max] = props.max;
        return res;
    }, [props.min, props.max]);

    //* 제어할 필드명 설정
    const field = useMemo(() => props.colDef.field, [props.colDef.field]);

    //* 그리드 필터 처리
    const doesFilterPass = useCallback((params) => {
        return (
            params.data[field] >= range[0] &&
            params.data[field] <= range[1]
        );
    }, [props.model]);

    //* 그리드 필터 관련 설정
    useGridFilter({
        doesFilterPass,
    });

    //* 변경 처리
    const setChange = (range: number[]|null) => {
        setRange(range ?? [props.min, props.max]);
        props.onModelChange(range);
    };

    return <>
        <div className={style['filter-range']}>
            {/* 슬라이더 */}
            <div>
                <UI_Slider
                    className={style['slider']}
                    range={true}
                    marks={marks}
                    value={range}
                    min={props.min}
                    max={props.max}
                    onChange={setRange}
                />
            </div>

            {/* 버튼 */}
            <div className={style['btn-area']}>
                <UI_Button
                    size='small'
                    onClick={() => setChange(null)}
                >Reset</UI_Button>
                <UI_Button
                    size='small'
                    type="primary"
                    onClick={() => setChange(range) }
                >Apply</UI_Button>
            </div>
        </div>
    </>;
}
