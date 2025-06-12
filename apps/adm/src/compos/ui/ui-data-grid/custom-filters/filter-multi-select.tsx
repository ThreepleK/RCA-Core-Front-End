import { useGridFilter, type CustomFilterProps } from "ag-grid-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { UI_Button, UI_Flex, UI_Select } from "../..";

import style from "./filter-multi-select.module.css";

export interface FilterMultiSelect extends CustomFilterProps {
    data: {                     // 선택 항목에 보여줄 내용
        label: string,
        value: string,
        disabled: boolean
    }[];
}

/**
 * 멀티 선택 필터
 * @param props
 * @param props.data 선택 항목
 */
export function FilterMultiSelect(props: FilterMultiSelect){
    const [isOpen, setIsOpen] = useState(false);
    const [select, setSelect] = useState<string[]|null>(props.model);

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
        return select.includes(v);
    }, [props.model]);

    //* 필터가 닫힐 때 이벤트
    const afterGuiDetached = useCallback(() => {
        // 아직 dropdown이 열려 있을 경우, 필터 다시 열기
        if( isOpen ){
            props.api.showColumnFilter(field);
        }
    }, [isOpen]);

    //* 그리드 필터 관련 설정
    useGridFilter({
        doesFilterPass,
        afterGuiDetached,
    });

    //* 선택 값 처리
    useEffect(() => {
        // 선택 항목이 0개면 초기화(null)
        const reData = Array.isArray(select) && select.length === 0
            ? null
            : select;

        props.onModelChange(reData);
    }, [select])

    return <>
        <div className={style['filter-multi-select']}>
            <UI_Select
                className={style['select']}
                mode="multiple"
                size='small'
                placeholder='Filter...'
                options={props.data}
                open={isOpen}
                onOpenChange={setIsOpen}
                onChange={setSelect}
                maxTagCount='responsive'
            />
            
            <UI_Flex justify="flex-end">
                <UI_Button
                    size='small'
                    onClick={() => setSelect(null)}
                >Reset</UI_Button>
            </UI_Flex>
        </div>
    </>;
}
