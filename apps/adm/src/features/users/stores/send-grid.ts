import { createSendAction } from "@/stores/send-event";

// 그리드 리스트 이벤트 전달 Store
export const useGridListEvent = createSendAction<any>();