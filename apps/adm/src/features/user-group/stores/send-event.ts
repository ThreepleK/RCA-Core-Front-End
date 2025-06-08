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