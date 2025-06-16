import type { SectionStore } from "@/stores";
import type { ReactNode } from "react";
import type { GridCreateParams, GridDeleteParams, GridEditParams, GridUpdateParams } from "./components";

export class GridConnPublic {
    conn: SectionStore;

    /**
     * 생성자
     * @param gridConn 그리드에서 넘겨준 Section Store Connector
     */
    constructor(gridConn: SectionStore){
        this.conn = gridConn;
    }

    /**
     * 로딩 처리
     * @param is true: 로딩 on / false: 로딩 off 
     */
    setLoading(is: boolean) {
        this.conn.trigger('loading', is);
    }

    /**
     * 데이터가 없을 시 보여줄 메시지
     * @param msg 메시지
     */
    setNoDataMsg(msg: string|ReactNode){
        this.conn.trigger('noDataMsg', msg);
    }

    /**
     * 그리드 row 선택 타입설정
     * @param type singleRow: 1개, multiRow: 여러개
     */
    setRowSelectionType(type: 'singleRow'|'multiRow'){
        this.conn.trigger('rowSelectionType', type);
    }

    /**
     * 그리드 해더 높이 설정
     * @param height 높이 (단위:px)
     */
    setHeaderCellHeight(height: string|ReactNode){
        this.conn.trigger('headerCellHeight', height);
    }

    /**
     * 그리드 리스트 설정 
     * @param data 리스트 데이터
     */
    setList(data: any[]){
        const list = !data ? [] : data;
        this.conn.trigger('list', list);
    }

    /**
     * [주의] 모달 창
     * @param title 제목 
     * @param content 내용 
     */
    openWarningModal(props: {
        title: string | ReactNode;
        content: string | ReactNode;
    }){
        this.conn.trigger('nodata-modal', {conn: this.conn, ...props});
    }

    /**
     * [생성] 모달 창
     * @param title                 모달 제목
     * @param srcRow                생성에 필요한 기본 row (폼, 검증, api에 두루 사용)
     * @param FormCompo             폼에 사용되는 컴포넌트
     * @param formValidationFn      폼 입력 내용 검증 함수
     * @param apiFn                 검증 이후 api에 호출 될 함수
     * @param callback              api 호출 이후 정상 처리 확인 콜백 함수
     * @param size                  모달 크기
     */
    openCreateModal(props: GridCreateParams){
        this.conn.trigger('create-modal', {conn: this.conn, ...props});
    }

    /**
     * [편집] 모달 창
     * @param title                 모달 제목
     * @param row                   Grid에서 넘어온 row 데이터 (폼, 검증, api에 두루 사용)
     * @param FormCompo             폼에 사용되는 컴포넌트
     * @param formValidationFn      폼 입력 내용 검증 함수
     * @param apiFn                 검증 이후 api에 호출 될 함수
     * @param callback              api 호출 이후 정상 처리 확인 콜백 함수
     * @param size                  모달 크기
     */
    openEditModal(props: GridEditParams){
        this.conn.trigger('edit-modal', {conn: this.conn, ...props});
    }

    /**
     * [삭제] 모달 창
     * @param title                 모달 제목
     * @param content               모달 내용
     * @param rows                  Grid에서 넘어온 삭제 대상 row 리스트 데이터
     * @param apiFn                 검증 이후 api에 호출 될 함수
     * @param callback              api 호출 이후 정상 처리 확인 콜백 함수
     * @param size                  모달 크기
     */
    openDeleteModal(props: GridDeleteParams){
        this.conn.trigger('delete-modal', {conn: this.conn, ...props});
    }

    /**
     * [수정] 모달 창
     * @param title                 모달 제목
     * @param content               모달 내용
     * @param rows                  Grid에서 넘어온 수정 대상 row 리스트 데이터
     * @param apiFn                 검증 이후 api에 호출 될 함수
     * @param callback              api 호출 이후 정상 처리 확인 콜백 함수
     * @param size                  모달 크기
     */
    openUpdateModal(props: GridUpdateParams){
        this.conn.trigger('update-modal', {conn: this.conn, ...props});
    }

    /**
     * [이벤트]
     * 그리드 데이터 row Update
     * @param cb 업데이트 시 처리될 콜백 함수
     */
    onRowDataUpdate(cb: ()=>void){
        this.conn.on('onRowDataUpdate', cb);
    }
}