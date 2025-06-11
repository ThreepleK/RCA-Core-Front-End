import { SectionStore } from "@/stores";
import { createSendAction } from "@/stores/send-event";

// User Group 페이지에서 사용될 이벤트 전달 Store
export const useLocalSendEvent = createSendAction<any>();

/**
 * Edit view에서 사용 될 이벤트 전달 용 store
 */
export type EditViewMap = {

    // ---- [Edit Drawer 기능] ---- //
    /**
     * [Edit Drawer]
     * @param is boolean
     * @description true: 열기 / false: 닫기
     */
    'edit-open': boolean,
    /**
     * [Edit Drawer]
     * @param title string
     * @description 제목 설정
     */
    'edit-title': string,
    /**
     * [Edit Drawer]
     * @param tabKey string
     * @description 초기 탭 설정
     */
    'edit-showTab': string,


    // ---- [Members 탭] ---- //
    /**
     * [Members 탭]
     * @param row any
     * @description grid row 데이터 전달
     */
    'tab-members': any,
    /**
     * [Members 탭]
     * @description 추가 버튼
     */
    'add-members': null,
    /**
     * [Members 탭]
     * @description 삭제 버튼
     */
    'remove-members': null,
    /**
     * [Members 탭]
     * @description 저장 버튼
     */
    'save-members': null,


    // ---- [Permission Set 탭] ---- //
    /**
     * [Permission Set 탭]
     * @param row any
     * @description grid row 데이터 전달
     */
    'tab-permission': any,
    /**
     * [Permission Set 탭]
     * @description 저장 버튼
     */
    'save-permission': null,


    // ---- [Settings 탭] ---- //
    /**
     * [Settings 탭]
     * @param row any
     * @description grid row 데이터 전달
     */
    'tab-settings': any,
    /**
     * [Permission Set 탭]
     * @description 저장 버튼
     */
    'save-settings': null,
    /**
     * [Permission Set 탭]
     * @description 저장 이후 이벤트
     */
    'tab-settings-update': null,
}
export type EditViewKey = keyof EditViewMap;
export const editViewStore = new SectionStore<EditViewMap>();

/**
 * UserGroup 편집 Drawer 열기
 * @param title 타이틀에 보여줄 내용
 * @param row 그리드에서 전달 한 row 값
 */
export function openEditDrawer({title, row}: {
    title: string,
    row: any,
}){
    // 순차 처리
    editViewStore.triggers({
        'edit-title': title,            // 제목 설정
        'edit-showTab': 'members',      // 처음 보여줄 탭 key
        'tab-members': {...row},        // Members 탭에 보낼 데이터
        'tab-permission': {...row},     // Permission Sets 탭에 보낼 데이터
        'tab-settings': {...row},       // Settings 탭에 보낼 데이터
        'edit-open': true,              // drawer 열기
    });
}