import type { ComponentType, ReactNode } from "react";

// 그리드 row 아이템
export type RowItem = {[key: string]: any};

//* 모달에서 사용되는 공통 params
export type GridModalCommParams = {
    title?: string|ReactNode,               // 모달에 보여줄 타이틀
    callback: () => void;                   // 확인 콜백
    apiFn: (rows: any) => ResponseResult,   // 관련 api 함수
}

/**
 * 모달 내에서 사용될 폼 컴포넌트
 * @param row 폼에 전달할 그리드 row 데이터
 * @param onSetData 한 항목당 변경할 데이터
 * @param errMsg 에러메시지
 * @param errCode 에러메시지 관련 row키 값
 */
export type FormComponent = ComponentType<{
    row: RowItem;
    onSetData: (value: any, key: string) => void;
    errMsg?: string;
    errCode?: string;
}>;

/**
 * 데이터 검증
 * @param type 신규/수정
 * @param row 관련 row
 */
export type FormValidationFn = (
    type: 'new'|'mod',
    row: RowItem,
) => ResponseResult;

/**
 * 응답 결과
 * @param isErr 에러 여부
 * @param code  문제가 되는 코드
 * @param msg   에러 메시지
 */
export type ResponseResult = Promise<{
    isErr: boolean;
    code?: string;
    msg: string;
    res?: any;
}>;

export * from './create-modal';
export * from './update-modal';
export * from './delete-modal';
export * from './edit-modal';