import type { ReactNode } from "react";
import type { ButtonItem, FeedbackCB, GridCreateParams, GridDeleteParams, GridEditParams, GridNodataParams, GridUpdateParams, ShowCont } from "./components";

export interface GridConnMap {
    // ---- [Grid 기능] ---- //
    /**
     * [Grid]
     * @param is boolean
     * @description 로딩 표기
     */
    'loading': boolean,
    /**
     * [Grid]
     * @param msg string|ReactNode
     * @description 데이터가 없을 시 보여질 메시지 설정
     */
    'noDataMsg': string|ReactNode,
    /**
     * [Grid]
     * @param height number
     * @description 그리드 헤더 셀 높이 설정
     */
    'headerCellHeight': number,
    /**
     * [Grid]
     * @param data any[]
     * @description 그리드에 보여질 row 리스트
     */
    'list': any[],
    /**
     * [Grid]
     * @param data null
     * @description 그리드 row 데이터 업데이트 이벤트
     */
    'onRowDataUpdate': null,


    // ---- [Grid Top 기능] ---- //
    /**
     * [Grid Top]
     * @param totalCount number
     * @description 그리드가 준비되었을 때 top에 전달 할 리스트 갯수 전달 용
     */
    'top-onLoad': number,
    /**
     * [Grid Top]
     * @description 필터 변경 이벤트 (Grid Top 전용)
     */
    'top-onFilterChange': null,
    /**
     * [Grid Top]
     * @description 정렬 변경 이벤트 (Grid Top 전용)
     */
    'top-onSortChange': null,
    /**
     * [Grid Top]
     * @description row 선택 이벤트 (Grid Top 전용)
     */
    'top-onRowSelected': null,


    // ---- [Modal 기능] ---- //
    /**
     * [Modal 기능]
     * @param props GridNodataParams
     * @description 데이터가 없을 때 모달
     */
    'nodata-modal': GridNodataParams,
    /**
     * [Modal 기능]
     * @param props GridCreateParams
     * @description 생성 관련 모달 처리
     */
    'create-modal': GridCreateParams,
    /**
     * [Modal 기능]
     * @param props GridEditParams
     * @description 편집 관련 모달 처리
     */
    'edit-modal': GridEditParams,
    /**
     * [Modal 기능]
     * @param props GridDeleteParams
     * @description 삭제 관련 모달 처리
     */
    'delete-modal': GridDeleteParams,
    /**
     * [Modal 기능]
     * @param props GridUpdateParams
     * @description 수정 관련 모달 처리
     */
    'update-modal': GridUpdateParams,


    // ---- [Modal 공통 기능] ---- //
    /**
     * [Modal 공통 기능]
     * @param is boolean
     * @description 모달 로딩
     */
    'modal-loading': boolean,
    /**
     * [Modal 공통 기능]
     * @param is boolean
     * @description 모달 열기/닫기
     */
    'modal-open': boolean,
    /**
     * [Modal 공통 기능]
     * @param title ShowCont
     * @description 모달 제목
     */
    'modal-title': ShowCont,
    /**
     * [Modal 공통 기능]
     * @param content ShowCont
     * @description 모달 본문
     */
    'modal-content': ShowCont,
    /**
     * [Modal 공통 기능]
     * @param buttons ButtonItem
     * @description 모달 버튼
     */
    'modal-btns': ButtonItem,
    /**
     * [Modal 공통 기능]
     * @param section ShowCont
     * @description 모달 하단 좌측 영역
     */
    'modal-btmLeftSection': ShowCont,
    /**
     * [Modal 공통 기능]
     * @param size string
     * @description 모달 크기
     */
    'modal-size': string,
    /**
     * [Modal 공통 기능]
     * @param errMsg ShowCont
     * @description 모달 에러 메시지
     */
    'modal-errMsg': ShowCont,
    /**
     * [Modal 공통 기능]
     * @param feedback FeedbackCB
     * @description 모달 버튼 피드백
     */
    'modal-feedback': FeedbackCB,
}
export type GridConnKey = keyof GridConnMap;