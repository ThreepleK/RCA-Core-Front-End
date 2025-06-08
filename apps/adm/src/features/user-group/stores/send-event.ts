import { SectionStore } from "@/stores";
import { createSendAction } from "@/stores/send-event";

// User Group 페이지에서 사용될 이벤트 전달 Store
export const useLocalSendEvent = createSendAction<any>();

/**
 * Edit view에서 사용 될 이벤트 전달 용 store
 * 
 * ---- [Edit Drawer 기능]
 * edit-open: 열기
 * edit-close: 닫기
 * edit-title: 제목 설정
 *   - (title: string) => void
 * edit-showTab: 처음에 보일 탭 설정
 *   - (tabKey: string) => void
 * 
 * ---- [Members 탭]
 * tab-members: 미리 전달할 grid row 데이터 전달
 *   - (row: any) => void
 * add-members:    추가 버튼
 * remove-members: 삭제 버튼
 * save-members:   저장 버튼
 * 
 * ---- [Permission Set 탭]
 * tab-permission: 미리 전달할 grid row 데이터 전달
 *   - (row: any) => void
 * save-permission: 저장 버튼
 * 
 * ---- [Settings 탭]
 * tab-settings: 미리 전달할 grid row 데이터 전달
 *   - (row: any) => void
 * tab-settings-update: Settings 저장 이후 이벤트
 * save-settings: 저장 버튼
 */
export const editViewStore = new SectionStore();

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